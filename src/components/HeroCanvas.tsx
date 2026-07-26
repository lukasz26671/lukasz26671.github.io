import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styles from './HeroCanvas.module.css'

type Props = {
  className?: string
}

const BG = 0x040b14
const GRID_SEG_X = 64
const GRID_SEG_Z = 40

const WAVE_GLSL = `
  float waveHeight(vec3 p, float time) {
    return sin(p.x * 0.05 + time * 0.5) * 3.0
         + cos(p.z * 0.05 + time * 0.3) * 3.0
         + sin(p.x * 0.1 - p.z * 0.1 + time) * 1.5;
  }
`

export function HeroCanvas({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(BG, 0.02)

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
    })
    const occlusion = new THREE.Mesh(geometry, occlusionMat)
    scene.add(occlusion)

    const dustGeom = new THREE.BufferGeometry()
    const dustCount = 300
    const dustPos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 100
      dustPos[i + 1] = Math.random() * 30
      dustPos[i + 2] = (Math.random() - 0.5) * 100
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    const dust = new THREE.Points(
      dustGeom,
      new THREE.PointsMaterial({
        color: 0x88ccff,
        size: 0.2,
        transparent: true,
        opacity: 0.6,
      }),
    )
    scene.add(dust)

    let targetX = 0
    let targetY = 15
    let raf = 0
    const clock = new THREE.Clock()

    const onMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1
      targetX = mouseX * 8
      targetY = 15 + mouseY * 4
    }

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()
      timeUniform.value = time

      dust.position.y = Math.sin(time * 0.2) * 2
      dust.rotation.y = time * 0.02

      camera.position.x += (targetX - camera.position.x) * 0.02
      camera.position.y += (targetY - camera.position.y) * 0.02
      camera.lookAt(0, 5, 0)

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
      dustGeom.dispose()
      pointsMat.dispose()
      wireframe.dispose()
      occlusionMat.dispose()
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
