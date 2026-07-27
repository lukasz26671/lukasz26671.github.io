import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styles from './HeroCanvas.module.css'

type Props = {
  className?: string
  diveProgress?: number
  /** Freeze wave/caustic time — still frame; camera still follows dive. */
  frozen?: boolean
}

const BG = 0x040b14
const GRID_SEG_X = 64
const GRID_SEG_Z = 40
/** Nice-looking wave phase for the frozen still. */
const FROZEN_TIME = 4.2

const WAVE_GLSL = `
  float waveHeight(vec3 p, float time) {
    return sin(p.x * 0.05 + time * 0.5) * 3.0
         + cos(p.z * 0.05 + time * 0.3) * 3.0
         + sin(p.x * 0.1 - p.z * 0.1 + time) * 1.5;
  }
`

const CAUSTIC_GLSL = `
  float causticPattern(vec2 uv, float t) {
    vec2 p = uv;
    float c = 0.0;
    c += abs(sin(p.x * 3.1 + t * 0.7) + sin(p.y * 2.4 - t * 0.55));
    c += abs(sin(p.x * 1.7 - p.y * 2.1 + t * 0.9));
    c *= abs(sin((p.x + p.y) * 1.3 - t * 0.4));
    return pow(clamp(c * 0.35, 0.0, 1.0), 2.4);
  }
`

export function HeroCanvas({ className, diveProgress = 0, frozen = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const diveRef = useRef(diveProgress)
  const frozenRef = useRef(frozen)

  useEffect(() => {
    diveRef.current = diveProgress
  }, [diveProgress])

  useEffect(() => {
    frozenRef.current = frozen
  }, [frozen])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    const fog = new THREE.FogExp2(BG, 0.02)
    scene.fog = fog

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 15, 40)

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(BG, 0)
    container.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(320, 150, GRID_SEG_X, GRID_SEG_Z)
    geometry.rotateX(-Math.PI / 2)

    const posAttribute = geometry.attributes.position
    const vertexCount = posAttribute.count
    for (let i = 0; i < vertexCount; i++) {
      const x = posAttribute.getX(i) + (Math.random() - 0.5) * 2.5
      const z = posAttribute.getZ(i) + (Math.random() - 0.5) * 2
      posAttribute.setXYZ(i, x, 0, z)
    }
    posAttribute.needsUpdate = true

    const timeUniform = { value: 0 }
    const diveUniform = { value: 0 }

    const pointsMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: timeUniform,
        uColor: { value: new THREE.Color(0x00d2ff) },
        uSize: { value: 3.2 * Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        ${WAVE_GLSL}
        void main() {
          vec3 p = position;
          p.y = waveHeight(p, uTime);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          float alpha = smoothstep(0.5, 0.18, d) * 0.9;
          if (alpha < 0.02) discard;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    })
    const points = new THREE.Points(geometry, pointsMat)
    scene.add(points)

    const wireframe = new THREE.ShaderMaterial({
      uniforms: {
        uTime: timeUniform,
        colorLow: { value: new THREE.Color(0x0a1520) },
        colorHigh: { value: new THREE.Color(0x00d2ff) },
      },
      vertexShader: `
        uniform float uTime;
        varying float vY;
        ${WAVE_GLSL}
        void main() {
          vec3 p = position;
          p.y = waveHeight(p, uTime);
          vY = p.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorLow;
        uniform vec3 colorHigh;
        varying float vY;
        void main() {
          float t = smoothstep(-2.5, 2.5, vY);
          vec3 c = mix(colorLow, colorHigh, t * 0.55);
          gl_FragColor = vec4(c, 0.18);
        }
      `,
      wireframe: true,
      transparent: true,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, wireframe)
    scene.add(mesh)

    const occlusionMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: timeUniform,
        uColor: { value: new THREE.Color(BG) },
      },
      vertexShader: `
        uniform float uTime;
        ${WAVE_GLSL}
        void main() {
          vec3 p = position;
          p.y = waveHeight(p, uTime);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          gl_FragColor = vec4(uColor, 1.0);
        }
      `,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      side: THREE.DoubleSide,
    })
    const occlusion = new THREE.Mesh(geometry, occlusionMat)
    scene.add(occlusion)

    const causticGeom = new THREE.PlaneGeometry(220, 160, 1, 1)
    causticGeom.rotateX(-Math.PI / 2)
    const causticMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: timeUniform,
        uDive: diveUniform,
        uColor: { value: new THREE.Color(0x4de8ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uDive;
        uniform vec3 uColor;
        varying vec2 vUv;
        ${CAUSTIC_GLSL}
        void main() {
          if (uDive < 0.08) discard;
          vec2 uv = (vUv - 0.5) * 8.0;
          float c = causticPattern(uv, uTime);
          c += causticPattern(uv * 1.35 + 1.7, uTime * 0.85) * 0.55;
          float vig = 1.0 - smoothstep(0.25, 0.95, length(vUv - 0.5) * 1.6);
          float alpha = c * vig * uDive * 0.55;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const caustics = new THREE.Mesh(causticGeom, causticMat)
    caustics.position.y = -26
    scene.add(caustics)

    const raysGeom = new THREE.PlaneGeometry(90, 70)
    const raysMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: timeUniform,
        uDive: diveUniform,
        uColor: { value: new THREE.Color(0x1ad4ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uDive;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          if (uDive < 0.12) discard;
          float x = vUv.x * 6.28318;
          float bands =
              pow(abs(sin(x * 2.0 + uTime * 0.25)), 12.0) * 0.55
            + pow(abs(sin(x * 3.4 - uTime * 0.18)), 18.0) * 0.35
            + pow(abs(sin(x * 1.2 + uTime * 0.1)), 8.0) * 0.2;
          float fall = pow(vUv.y, 1.6) * (1.0 - abs(vUv.x - 0.5) * 1.4);
          float alpha = bands * fall * uDive * 0.22;
          gl_FragColor = vec4(uColor, max(alpha, 0.0));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    const rays = new THREE.Mesh(raysGeom, raysMat)
    rays.position.set(0, -8, -18)
    rays.rotation.x = -0.55
    scene.add(rays)

    const dustGeom = new THREE.BufferGeometry()
    const dustCount = 420
    const dustPos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 110
      dustPos[i + 1] = Math.random() * 42 - 28
      dustPos[i + 2] = (Math.random() - 0.5) * 110
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    const dust = new THREE.Points(
      dustGeom,
      new THREE.PointsMaterial({
        color: 0x88ccff,
        size: 0.18,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    )
    scene.add(dust)

    let mouseTargetX = 0
    let mouseTargetY = 15
    let raf = 0
    let simTime = frozenRef.current ? FROZEN_TIME : 0
    const clock = new THREE.Clock()
    const look = new THREE.Vector3(0, 5, 0)

    const onMove = (event: MouseEvent) => {
      if (frozenRef.current) return
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1
      mouseTargetX = mouseX * 8
      mouseTargetY = 15 + mouseY * 4
    }

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      const isFrozen = frozenRef.current

      if (isFrozen) {
        if (simTime === 0) simTime = FROZEN_TIME
        mouseTargetX = 0
        mouseTargetY = 15
      } else {
        simTime += dt
      }

      const time = simTime
      timeUniform.value = time

      const dive = diveRef.current
      const d = dive * dive * (3 - 2 * dive)
      diveUniform.value = d

      // Dive camera still follows scroll; wave/caustic time is frozen when reduced.
      const camEase = isFrozen ? 0.12 : 0.04
      const camY = THREE.MathUtils.lerp(mouseTargetY, -18, d)
      const camZ = THREE.MathUtils.lerp(40, 16, d)
      const lookY = THREE.MathUtils.lerp(5, -4, d)
      const lookZ = THREE.MathUtils.lerp(0, -28, d)
      const fov = THREE.MathUtils.lerp(75, 62, d)
      if (Math.abs(camera.fov - fov) > 0.05) {
        camera.fov = fov
        camera.updateProjectionMatrix()
      }

      camera.position.x += (mouseTargetX * (1 - d * 0.7) - camera.position.x) * (isFrozen ? 0.15 : 0.02)
      camera.position.y += (camY - camera.position.y) * camEase
      camera.position.z += (camZ - camera.position.z) * camEase
      look.y += (lookY - look.y) * (isFrozen ? 0.14 : 0.045)
      look.z += (lookZ - look.z) * (isFrozen ? 0.14 : 0.045)
      camera.lookAt(look)

      fog.color.setHex(d > 0.5 ? 0x021820 : BG)
      fog.density = THREE.MathUtils.lerp(0.02, 0.055, d)

      caustics.position.x = Math.sin(time * 0.08) * 4
      caustics.position.z = Math.cos(time * 0.06) * 3
      rays.position.x = mouseTargetX * 0.15 * d

      dust.position.y = Math.sin(time * 0.15) * 1.2
      dust.rotation.y = time * 0.015
      ;(dust.material as THREE.PointsMaterial).opacity = THREE.MathUtils.lerp(0.55, 0.4, d)

      renderer.render(scene, camera)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      causticGeom.dispose()
      raysGeom.dispose()
      dustGeom.dispose()
      pointsMat.dispose()
      wireframe.dispose()
      occlusionMat.dispose()
      causticMat.dispose()
      raysMat.dispose()
      ;(dust.material as THREE.Material).dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`${styles.canvas} ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}
