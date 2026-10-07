import { useEffect, useState } from 'react'
import { motion, animate } from 'framer-motion'
import HeroBg from './HeroBg.jsx'
import ScannerCardStream from './ScannerCardStream.jsx'
import { useLang } from '../i18n.jsx'

const CARD_IMAGES = ['/images/card-15000.webp', '/images/card-40000.webp', '/images/card-25000.webp', '/images/card-40000-b.jpg', '/images/card-10000.jpg', '/images/card-5000.jpg']

/* الشعار: ميدالية زجاجية — تمايل هادئ، لمعان متنقّل، والشعار يتنفس بهدوء */
function Emblem() {
  return (
    <div className="emb">
      <span className="emb-aura" />
      <motion.div className="emb-stage"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}>
        <div className="emb-sway">
          <div className="emb-float">
            <span className="emb-bezel">
              <span className="emb-face">
                <span className="emb-logo"><img src="/images/logo.png" alt="ماسال" width="96" height="96" draggable="false" /></span>
                <span className="emb-cap">MASAL</span>
                <span className="emb-scan" />
              </span>
              <span className="emb-glare" />
              <span className="emb-shine" />
            </span>
          </div>
        </div>
        <span className="emb-floor" />
      </motion.div>
    </div>
  )
}

/* عدّاد يصعد بنعومة عند ظهور الصفحة */
function CountUp({ to, from = 0, prefix = '', suffix = '', delay = 2 }) {
  const [v, setV] = useState(from)
  useEffect(() => {
    const c = animate(from, to, { delay, duration: 2.2, ease: [0.22, 1, 0.36, 1], onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [to, from, delay])
  return <b>{prefix}{to > 1900 && to < 2100 ? v : v.toLocaleString('en-US')}{suffix}</b>
}

const Ico = ({ d, extra }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />{extra}
  </svg>
)
const TRUST = [
  [<CountUp key="a" to={2012} from={1990} />, 'hero.t1', <Ico key="ia" d="M7 3v3M17 3v3M4 8.5h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5z" extra={<path d="M8.5 13h3" />} />],
  [<CountUp key="b" to={10000} prefix="+" delay={2.2} />, 'hero.t2', <Ico key="ib" d="M12 21s-6.5-5.4-6.5-10.2a6.5 6.5 0 1 1 13 0C18.5 15.6 12 21 12 21z" extra={<circle cx="12" cy="10.6" r="2.3" />} />],
  [<CountUp key="c" to={100} suffix="%" delay={2.4} />, 'hero.t3', <Ico key="ic" d="M12 3l7.5 3v5.2c0 4.6-3.1 8.2-7.5 9.8-4.4-1.6-7.5-5.2-7.5-9.8V6L12 3z" extra={<path d="M8.8 12.2l2.3 2.3 4.2-4.4" />} />],
]

export default function Hero() {
  const { t } = useLang()
  const up = (d) => ({ initial: { opacity: 0, y: 28}, animate: { opacity: 1, y: 0}, transition: { delay: d, duration: 1, ease: [0.22, 1, 0.36, 1] } })
  return (
    <section className="hero hero-c" id="top">
      <HeroBg />
      <div className="hc-wrap">

        <div className="hc-copy">
          <motion.span className="hc-badge" {...up(0.5)}><i />{t('hero.badge')}</motion.span>
          <h1 className="h1" aria-label={`${t('hero.h1a')} ${t('hero.h1b')} ${t('hero.h1c')}`}>
            {[[t('hero.h1a'), ''], [t('hero.h1b'), 'h1-hl'], [t('hero.h1c'), 'h1-dim']].map(([tx, c], i) => (
              <span key={tx} className={`h1-line ${c}`}>
                <motion.span initial={{ y: 30, opacity: 0}} animate={{ y: 0, opacity: 1}} transition={{ delay: 0.7 + i * 0.14, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                  {c === 'h1-hl' ? <span className="red">{tx}</span> : tx}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero-sub" {...up(1.45)}>
            {t('hero.sub')}
          </motion.p>
        </div>

        <ScannerCardStream images={CARD_IMAGES} />

        <motion.div className="hc-trust" {...up(1.8)}>
          {TRUST.map(([n, l, ico], i) => (
            <div key={l} className="tr-cell" style={{ animationDelay: `${2 + i * 0.15}s` }}>
              <span className="tr-ico">{ico}</span>
              <span className="tr-txt">{n}<span>{t(l)}</span></span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
