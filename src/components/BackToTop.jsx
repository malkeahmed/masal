import { useEffect, useRef, useState } from 'react'

/* زر العودة للأعلى: مربع زجاجي بحلقة تقدّم حمراء تعكس موضع التمرير */
export default function BackToTop() {
  const [show, setShow] = useState(false)
  const ring = useRef(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      if (ring.current) ring.current.style.strokeDashoffset = String(1 - p)
      setShow(window.scrollY > 600)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  const up = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button className={'btt' + (show ? ' on' : '')} onClick={up} aria-label="العودة للأعلى" tabIndex={show ? 0 : -1}>
      <svg className="btt-ring" viewBox="0 0 56 56" aria-hidden>
        <rect x="2" y="2" width="52" height="52" rx="15" pathLength="1" className="btt-track" />
        <rect x="2" y="2" width="52" height="52" rx="15" pathLength="1" className="btt-bar" ref={ring} />
      </svg>
      <span className="btt-ico" aria-hidden>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
        </svg>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
        </svg>
      </span>
    </button>
  )
}
