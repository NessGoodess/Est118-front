'use client'

import { useEffect, useRef } from 'react'
import './mouse-blur.css'

const LAYERS = 15
const SPEED = 0.08 // suavidad (0.05 = más lento)

export default function MouseBlur() {
  const wraps = useRef<HTMLDivElement[]>([])
  const mouse = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX * -0.1
      mouse.current.y = e.clientY * -0.1
    }

    const animate = () => {
      // LERP (interpolación suave)
      current.current.x += (mouse.current.x - current.current.x) * SPEED
      current.current.y += (mouse.current.y - current.current.y) * SPEED

      wraps.current.forEach((el, i) => {
        if (!el) return
        const depth = i * 0.6

        el.style.transform = `
          translate3d(
            ${current.current.x - depth}px,
            ${current.current.y - depth}px,
            0
          )
        `
      })

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    requestAnimationFrame(animate)

    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <>
      <div id="intro">
        <h1>
          MOUSE MOVEMENT <br />
          <b>BACKGROUND BLUR</b>
        </h1>
        <h2>Move the cursor fast and slooooooooowww</h2>
      </div>

      {Array.from({ length: LAYERS }).map((_, i) => (
        <div
          key={i}
          className="wrap"
          ref={(el) => {
            if (el) wraps.current[i] = el
          }}
          style={{
            opacity: i === 0 ? 1 : 0.6 - i * 0.03,
          }}
        />
      ))}
    </>
  )
}
