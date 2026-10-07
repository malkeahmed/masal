import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useSpring } from 'framer-motion'

/* خلفية جزيئات حمراء تتفاعل مع الماوس */
export function ParticleField() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c.getContext('2d')
    let w, h, raf
    const mouse = { x: -999, y: -999 }
    let pts = []
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(110, Math.floor((w * h) / 14000))
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }))
    }
    const move = (e) => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy)
        if (d < 140 && d > 0) { p.x -= (dx / d) * 0.8; p.y -= (dy / d) * 0.8 }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283)
        ctx.fillStyle = 'rgba(255,40,50,.75)'; ctx.fill()
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], dd = Math.hypot(p.x - q.x, p.y - q.y)
          if (dd < 120) {
            ctx.strokeStyle = `rgba(229,9,20,${(1 - dd / 120) * 0.28})`
            ctx.lineWidth = 0.7
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', move)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', move) }
  }, [])
  return <canvas ref={ref} className="particles" />
}

/* هالة حمراء تتبع المؤشر */
export function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf
    const m = (e) => { tx = e.clientX; ty = e.clientY }
    const loop = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12
      if (ref.current) ref.current.style.transform = `translate(${x - 250}px,${y - 250}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', m); loop()
    return () => { window.removeEventListener('mousemove', m); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="cursor-glow" />
}

export function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return <motion.div className="scroll-bar" style={{ scaleX }} />
}

export function Reveal({ children, delay = 0, y = 40, className = '' }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  )
}

export function Counter({ to, suffix = '', plain = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const t0 = performance.now(), dur = 2200
    let raf
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1)
      setV(Math.round(to * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return <span ref={ref}>{plain ? v : v.toLocaleString('en-US')}{suffix}</span>
}

/* بطاقة تميل ثلاثية الأبعاد مع لمعة */
export function Tilt({ children, className = '' }) {
  const ref = useRef(null)
  const on = (e) => {
    const el = ref.current, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 14}deg)`
    el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`)
  }
  const off = () => { ref.current.style.transform = '' }
  return <div ref={ref} onMouseMove={on} onMouseLeave={off} className={`tilt ${className}`}>{children}</div>
}
