import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, Tilt, Counter } from './Fx.jsx'
import { useLang } from '../i18n.jsx'
import { CARDS, CARD_FILTERS, GALLERY } from '../data.js'

/* ================= قسم الكروت ================= */
export function CardsSection() {
  const [f, setF] = useState('all')
  const list = CARDS.filter((c) => f === 'all' || c.cat === f)
  return (
    <section className="sec" id="cards">
      <div className="container">
        <Reveal className="sec-head">
          <span className="kicker">بطاقاتنا</span>
          <h2>اختر الكرت <span className="red">المناسب لك</span></h2>
          <p>تشكيلة واسعة من الكروت الإلكترونية الأصلية، لكل استخدام وكل ميزانية.</p>
        </Reveal>
        <Reveal className="tabs">
          {CARD_FILTERS.map(([k, t]) => (
            <button key={k} className={f === k ? 'on' : ''} onClick={() => setF(k)}>
              {f === k && <motion.i layoutId="tab" className="tab-bg" />}<span>{t}</span>
            </button>
          ))}
        </Reveal>
        <motion.div layout className="pc-grid">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <motion.div key={c.title} layout initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.4 }}>
                <Tilt className="pc">
                  <div className={`pc-face t-${c.tone}`}>
                    <div className="pc-top"><span>ماسال</span><b>{c.icon}</b></div>
                    <div className="pc-chip" />
                    <div className="pc-name">{c.title}</div>
                    <span className="pcard-shine" />
                  </div>
                  <div className="pc-info">
                    <div><h3>{c.title}</h3><small>{c.sub}</small></div>
                    <a href="#top" className="pc-btn" aria-label="اطلب">←</a>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* ================= ألبوم صور ماسال ================= */
const ALBUM = [
  { src: '/images/gallery/g1.jpg', cls: 'p1' },
  { src: '/images/gallery/g2.jpg', cls: 'p2' },
  { src: '/images/gallery/g3.jpg', cls: 'p3' },
  { src: '/images/gallery/g4.jpg', cls: 'p4', pos: '50% 30%' },
  { src: '/images/gallery/g5.jpg', cls: 'p5' },
  { src: '/images/gallery/g6.jpg', cls: 'p6' },
  { src: '/images/gallery/g7.jpg', cls: 'p7' },
]

export function Gallery() {
  const { t, lang } = useLang()
  const rtl = lang === 'ar'
  const items = t('gal.items')
  const ALBUM_T = ALBUM.map((g, i) => ({ ...g, title: items[i][0], sub: items[i][1] }))
  const [open, setOpen] = useState(null)
  const n = ALBUM.length
  const go = (d) => setOpen((o) => (o === null ? o : (o + d + n) % n))
  useEffect(() => {
    if (open === null) return
    const k = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowLeft') go(rtl ? 1 : -1)
      if (e.key === 'ArrowRight') go(rtl ? -1 : 1)
    }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open, rtl])
  return (
    <section className="sec gl-sec" id="gallery">
      <div className="container">
        <Reveal className="sec-head">
          <span className="kicker">{t('gal.kicker')}</span>
          <h2>{t('gal.h2a')} <span className="red">{t('gal.h2b')}</span></h2>
          <p>{t('gal.text')}</p>
        </Reveal>
        <div className="al-grid">
          {ALBUM_T.map((g, i) => (
            <motion.button key={g.src} className={'al ' + g.cls} onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 50, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.09, ease: [0.22, 1, 0.36, 1] }}>
              <img src={g.src} alt={g.title} loading="lazy" decoding="async" style={g.pos ? { objectPosition: g.pos } : undefined} draggable="false" />
              <span className="al-shade" />
              <span className="al-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="al-zoom" aria-hidden><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg></span>
              <span className="al-cap"><b>{g.title}</b><small>{g.sub}</small></span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div className="lbx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={() => setOpen(null)}>
            <button className="lbx-x" onClick={() => setOpen(null)} aria-label={t('gal.close')}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
            <button className="lbx-n r" onClick={(e) => { e.stopPropagation(); go(rtl ? -1 : 1) }} aria-label={rtl ? t('gal.prev') : t('gal.next')}><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
            <button className="lbx-n l" onClick={(e) => { e.stopPropagation(); go(rtl ? 1 : -1) }} aria-label={rtl ? t('gal.next') : t('gal.prev')}><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></button>
            <AnimatePresence mode="wait">
              <motion.figure key={open} className="lbx-f" onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <img src={ALBUM_T[open].src} alt={ALBUM_T[open].title} draggable="false" />
                <figcaption><b>{ALBUM_T[open].title}</b><small>{ALBUM_T[open].sub}</small><span>{open + 1} / {n}</span></figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
