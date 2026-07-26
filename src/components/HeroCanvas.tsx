import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styles from './HeroCanvas.module.css'

type Props = {
  className?: string
}

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
    scene.fog = new THREE.FogExp2(0x040b14, 0.015)

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 15, 40)

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x040b14, 1)
    container.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(150, 150, 45, 45)
    geometry.rotateX(-Math.PI / 2)

    const posAttribute = geometry.attributes.position
    const vertexCount = posAttribute.count
    for (let i = 0; i < vertexCount; i++) {
      posAttribute.setX(i, posAttribute.getX(i) + (Math.random() - 0.5) * 2)
      posAttribute.setZ(i, posAttribute.getZ(i) + (Math.random() - 0.5) * 2)
    }

    const points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0x00d2ff,
        size: 0.4,
        transparent: true,
        opacity: 0.9,
      }),
    )
    scene.add(points)

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color: 0x0055aa,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      }),
    )
    scene.add(mesh)

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

    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 15
    let raf = 0
    const clock = new THREE.Clock()

    const onMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
      targetX = mouseX * 8
      targetY = 15 + mouseY * 4
    }

    const onResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()
      const positions = geometry.attributes.position
      for (let i = 0; i < vertexCount; i++) {
        const x = positions.getX(i)
        const z = positions.getZ(i)
        const y =
          Math.sin(x * 0.05 + time * 0.5) * 3 +
          Math.cos(z * 0.05 + time * 0.3) * 3 +
          Math.sin(x * 0.1 - z * 0.1 + time) * 1.5
        positions.setY(i, y)
      }
      positions.needsUpdate = true

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
