import { useEffect, useMemo, useRef, useState } from 'react'
import { enhanceImage } from './enhanceImage.js'
import './scanner.css'

/* مجرى كروت يعبر ماسحًا ضوئيًا في الوسط: الجزء الذي يمرّ على الماسح يتحوّل من صورة الكرت إلى «كود» */

const ASCII_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|/"\'`~?'
const genCode = (cols, rows) => {
  let out = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) out += ASCII_CHARS[(Math.random() * ASCII_CHARS.length) | 0]
    out += '\n'
  }
  return out
}

const COLS = 46, ROWS = 15 // أكبر حجم للكرت؛ الزائد يُقصّ تلقائيًا
const BASE_SPEED = 62 // px/s
const START_SPEED = 300 // دفعة أولى تهدأ تدريجيًا
const PARTICLES_IDLE = 70, PARTICLES_SCAN = 230

export default function ScannerCardStream({ images, repeat = 4 }) {
  // الصور الصغيرة تُكبَّر وتُشحذ قبل العرض (الكروت تظهر بعد اكتمالها)
  const [srcs, setSrcs] = useState([])
  useEffect(() => {
    let live = true
    Promise.all(images.map((s) => enhanceImage(s))).then((r) => { if (live) setSrcs(r) })
    return () => { live = false }
  }, [images])
  const cards = useMemo(
    () => Array.from({ length: srcs.length * repeat }, (_, i) => ({ id: i, src: srcs[i % srcs.length], ascii: genCode(COLS, ROWS) })),
    [srcs, repeat],
  )

  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const lineRef = useRef(null)
  const canvasRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const root = rootRef.current, track = trackRef.current, line = lineRef.current, canvas = canvasRef.current
    if (!root || !cards.length) return
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0, cw = 300, step = 340
    const S = { pos: 0, v: START_SPEED, dir: -1, drag: false, lastX: 0, lastT: 0, vx: 0 }
    const clipCache = cards.map(() => '')
    const scrambleUntil = cards.map(() => 0)
    const scanned = cards.map(() => false)
    let ambient = []
    let sparks = []
    let maxSparks = PARTICLES_IDLE
    let raf

    const resize = () => {
      W = root.clientWidth; H = root.clientHeight
      cw = Math.round(Math.min(300, Math.max(170, W * 0.2)))
      const ch = Math.round(cw / 1.58)
      step = cw + Math.round(cw * 0.2)
      root.style.setProperty('--cw', `${cw}px`)
      root.style.setProperty('--ch', `${ch}px`)
      canvas.width = W; canvas.height = H
      ambient = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: 20 + Math.random() * 50, a: 0.15 + Math.random() * 0.45, r: 0.6 + Math.random() * 0.9 }))
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(root)

    const spark = () => ({ x: W / 2 + (Math.random() - 0.5) * 3, y: Math.random() * H, vx: 0.25 + Math.random() * 1.1, vy: (Math.random() - 0.5) * 0.3, r: 0.5 + Math.random() * 0.7, a: 0.55 + Math.random() * 0.45, life: 1, decay: 0.006 + Math.random() * 0.02 })

    // سحب بالماوس/اللمس
    const down = (e) => { S.drag = true; S.lastX = e.clientX; S.lastT = performance.now(); S.vx = 0; track.setPointerCapture?.(e.pointerId); track.classList.add('grab') }
    const move = (e) => {
      if (!S.drag) return
      const now = performance.now(), dx = e.clientX - S.lastX, dt = Math.max(1, now - S.lastT) / 1000
      S.pos += dx; S.vx = S.vx * 0.6 + (dx / dt) * 0.4; S.lastX = e.clientX; S.lastT = now
    }
    const up = () => {
      if (!S.drag) return
      S.drag = false; track.classList.remove('grab')
      S.dir = S.vx < 0 ? -1 : 1 // يكمل في اتجاه السحب
      S.v = Math.min(900, Math.abs(S.vx))
    }
    track.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)

    let last = performance.now()
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now
      if (!S.drag) {
        S.v += (BASE_SPEED - S.v) * (1 - Math.exp(-dt * 1.1)) // هدوء تدريجي نحو السرعة الأساسية
        S.pos += S.v * S.dir * dt
      }
      const total = cards.length * step
      const scL = W / 2 - 3, scR = W / 2 + 3
      let anyScan = false

      for (let i = 0; i < cards.length; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        const left = ((((S.pos + i * step) % total) + total) % total) - step
        el.style.transform = `translate3d(${left}px,0,0)`
        if (left > W + 4 || left + cw < -4) continue
        const normal = el.firstChild, ascii = el.lastChild
        let cr, cl
        if (left < scR && left + cw > scL) {
          anyScan = true
          if (!scanned[i]) { scanned[i] = true; scrambleUntil[i] = now + 320 }
          cr = ((Math.max(scL - left, 0)) / cw) * 100
          cl = ((Math.min(scR - left, cw)) / cw) * 100
        } else {
          scanned[i] = false
          const passed = left + cw <= scL // اجتاز الماسح بالكامل (حين الاتجاه لليسار)
          const before = left >= scR
          const full = S.dir === -1 ? passed : before
          cr = full ? 100 : 0; cl = full ? 100 : 0
        }
        const key = `${cr.toFixed(1)}|${cl.toFixed(1)}`
        if (key !== clipCache[i]) {
          clipCache[i] = key
          normal.style.setProperty('--clip-right', `${cr}%`)
          ascii.style.setProperty('--clip-left', `${cl}%`)
        }
        // «خلط» الأحرف لحظة المرور
        if (now < scrambleUntil[i]) {
          const pre = ascii.firstChild
          if (!pre._t || now - pre._t > 40) { pre.textContent = genCode(COLS, ROWS); pre._t = now }
        } else if (scrambleUntil[i]) { scrambleUntil[i] = 0; ascii.firstChild.textContent = cards[i].ascii }
      }
      line.classList.toggle('on', anyScan)

      // جسيمات: خلفية هادئة + شرر ينبعث من الماسح
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      for (const p of ambient) {
        p.x += p.v * dt; if (p.x > W + 5) { p.x = -5; p.y = Math.random() * H }
        ctx.globalAlpha = p.a; ctx.fillRect(p.x, p.y, p.r * 1.6, p.r * 1.6)
      }
      maxSparks += ((anyScan ? PARTICLES_SCAN : PARTICLES_IDLE) - maxSparks) * 0.06
      while (sparks.length < maxSparks) sparks.push(spark())
      while (sparks.length > maxSparks) sparks.pop()
      ctx.fillStyle = '#ff8f86'
      for (let i = 0; i < sparks.length; i++) {
        const p = sparks[i]
        p.x += p.vx; p.y += p.vy; p.life -= p.decay
        if (p.life <= 0 || p.x > W) { sparks[i] = spark(); continue }
        ctx.globalAlpha = p.a * p.life; ctx.fillRect(p.x, p.y, p.r * 1.8, p.r * 1.8)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect()
      track.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [cards])

  return (
    <div className="ss" ref={rootRef} aria-hidden>
      <canvas className="ss-canvas" ref={canvasRef} />
      <div className="ss-line" ref={lineRef} />
      <div className="ss-track" ref={trackRef}>
        {cards.map((c, i) => (
          <div key={c.id} className="ss-card" ref={(el) => (cardRefs.current[i] = el)}>
            <div className="ss-normal"><img src={c.src} alt="" draggable="false" decoding="async" /></div>
            <div className="ss-ascii"><pre>{c.ascii}</pre></div>
          </div>
        ))}
      </div>
      <div className="ss-fade l" /><div className="ss-fade r" />
    </div>
  )
}
