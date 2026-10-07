import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { useLang } from '../i18n.jsx'

const NAV_HREFS = ['#about', '#services', '#gallery']
const NAV_KEYS = ['nav.about', 'nav.services', 'nav.gallery']

const Sun = ({ spin }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <g className={spin ? 'rays' : ''}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="12" y1="2.5" x2="12" y2="5" transform={`rotate(${a} 12 12)`} />
      ))}
    </g>
  </svg>
)
const Moon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
  </svg>
)

function LangSwitch() {
  const { lang, setLang, t } = useLang()
  return (
    <button className="pn-lang" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} aria-label={t('nav.langAria')} title={t('nav.langAria')}>
      <svg className="pl-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.8 4 5.8 4 9s-1.4 6.2-4 9c-2.6-2.8-4-5.8-4-9s1.4-6.2 4-9z" />
      </svg>
      <b className="pl-code" key={lang}>{t('nav.langShort')}</b>
      <i className="pl-bar" aria-hidden />
    </button>
  )
}

function ThemeSwitch() {
  const { t: tr } = useLang()
  const [t, setT] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark' } catch { return 'dark' }
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t)
    try { localStorage.setItem('theme', t) } catch { /* ignore */ }
  }, [t])
  const dark = t === 'dark'
  return (
    <button className={`pn-switch ${dark ? 'is-dark' : 'is-light'}`} aria-label={tr('nav.theme')} onClick={() => setT(dark ? 'light' : 'dark')}>
      <span className="pn-ico i-sun"><Sun /></span>
      <span className="pn-ico i-moon"><Moon /></span>
      <motion.i className="pn-thumb" layout transition={{ type: 'spring', stiffness: 500, damping: 32 }}>
        {dark ? <Moon key="m" /> : <Sun key="s" spin />}
      </motion.i>
    </button>
  )
}

export default function Navbar() {
  const { t, arrow } = useLang()
  const NAV = NAV_HREFS.map((h, i) => [t(NAV_KEYS[i]), h])
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', (e.clientX - r.left) + 'px')
    e.currentTarget.style.setProperty('--my', (e.clientY - r.top) + 'px')
  }
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [hover, setHover] = useState('')

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 30)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  /* تمييز القسم الحالي أثناء التمرير */
  useEffect(() => {
    const els = NAV.map(([, h]) => document.querySelector(h)).filter(Boolean)
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    const top = () => window.scrollY < 200 && setActive('')
    window.addEventListener('scroll', top, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', top) }
  }, [])

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  const shown = hover || active
  return (
    <>
      <motion.header className={`pnav ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>
        <div className="pn-bar" onMouseMove={spot}>
          <span className="pn-spot" />
          <motion.span className="pn-progress" style={{ scaleX: progress }} />
          <span className="pn-border" />
          <a href="#top" className="pn-logo" onClick={() => setOpen(false)}>
            <span className="pn-mark"><img src="/images/logo.png" alt={t('brand')} width="44" height="44" /></span>
            <span className="pn-name">{t('brand')}<small>MASAL</small></span>
          </a>

          <nav className="pn-links" onMouseLeave={() => setHover('')}>
            {NAV.map(([tx, h]) => (
              <a key={h} href={h} className={active === h ? 'on' : ''} onMouseEnter={() => setHover(h)}>
                {shown === h && <motion.span layoutId="pn-pill" className="pn-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{tx}</span>
              </a>
            ))}
          </nav>

          <div className="pn-right">
            <LangSwitch />
            <ThemeSwitch />
            <a href="#top" className="pn-user" aria-label={t('nav.login')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.500 2 8 6" /></svg>
            </a>
            <a href="#join" className="pn-cta">
              <i className="pn-live" /><span>{t('nav.join')}</span>
              <i className="pn-arrow">{arrow}</i>
            </a>
            <button className={`pn-burger ${open ? 'x' : ''}`} aria-label={t('nav.menu')} onClick={() => setOpen(!open)}><i /><i /><i /></button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="pn-sheet" initial={{ clipPath: 'circle(0% at 90% 5%)' }} animate={{ clipPath: 'circle(150% at 90% 5%)' }} exit={{ clipPath: 'circle(0% at 90% 5%)' }} transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}>
            <div className="pn-sheet-in">
              {NAV.map(([tx, h], i) => (
                <motion.a key={h} href={h} onClick={() => setOpen(false)} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.07 }}>
                  <em>{String(i + 1).padStart(2, '0')}</em>{tx}
                </motion.a>
              ))}
              <motion.a href="#join" className="pn-cta big" onClick={() => setOpen(false)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <span>{t('nav.join')}</span><i className="pn-arrow">{arrow}</i>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
