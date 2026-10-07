import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Reveal, Counter, Tilt } from './Fx.jsx'
import { enhanceImage } from './enhanceImage.js'
import { LOGO } from '../brandLogos.js'
import { useLang } from '../i18n.jsx'

const Head = ({ kicker, title, text }) => (
  <Reveal className="sec-head">
    <span className="kicker">{kicker}</span>
    <h2>{title}</h2>
    {text && <p>{text}</p>}
  </Reveal>
)

/* شريطان متقاطعان بشكل X: أحمر في الأمام يتحرك لجهة، وداكن في الخلف يتحرك للجهة المعاكسة */
export function MarqueeX() {
  const { t } = useLang()
  const base = t('mx')
  const rowA = [...base, ...base]
  const rowB = [...base.slice(4), ...base.slice(0, 4), ...base.slice(4), ...base.slice(0, 4)]
  const Strip = ({ cls, row }) => (
    <div className={'mx-strip ' + cls}>
      <div className="marquee-track">{row.map((t, i) => <span key={i}>{t}<b>✦</b></span>)}</div>
    </div>
  )
  return (
    <div className="mx" aria-hidden>
      <Strip cls="mx-b" row={rowB} />
      <Strip cls="mx-a" row={rowA} />
    </div>
  )
}

const IconTarget = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /><path d="M16.5 7.5 21 3M18 3h3v3" />
  </svg>
)
const IconRocket = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 15c-1.5 1-2 4-2 6 2 0 5-.5 6-2M14.5 4.5C17.5 2.5 21 3 21 3s.5 3.5-1.5 6.5L14 15l-5-5 5.5-5.5z" /><circle cx="15.5" cy="8.5" r="1.4" /><path d="M9 10l-3-.5L3 12l4 1M14 15l.5 3L12 21l-1-4" />
  </svg>
)

const PANEL_ICO = [null, <IconTarget />, <IconRocket />]
const mark = (s) => <mark key={s}>{s}</mark>
const hl = (s) => <span className="ab-hl2">{s}</span>

function PanelBody({ i }) {
  const { t } = useLang()
  if (i === 0) return (
    <>
      <p className="ab-lead">{t('about.lead')(mark)}</p>
      <div className="ab-cols">
        <p>{t('about.c1')}</p>
        <p>{t('about.c2')}</p>
      </div>
    </>
  )
  if (i === 1) return <p className="ab-big">{t('about.vision')(hl)}</p>
  return <p className="ab-big">{t('about.mission')(hl)}</p>
}

export function About() {
  const { t, lang } = useLang()
  const TITLE = [[t('about.t1'), ''], [t('about.t2'), 'ab-hl']]
  const PROV = t('about.provs')
  const PANELS = [1, 2, 3].map((n) => ({ n: '0' + n, t: t('about.p' + n), ico: PANEL_ICO[n - 1] }))
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true, margin: '-60px' })
  const [act, setAct] = useState(0)
  return (
    <section className="sec ab" id="about">
      <div className="ab-bg" aria-hidden />
      <div className="container ab-wrap">
        <header className="ab-head">
          <Reveal y={20}><span className="kicker">{t('about.kicker')}</span></Reveal>
          <h2 className="ab-title" ref={titleRef} aria-label={TITLE.map((x) => x[0]).join(' ')}>
            {TITLE.map(([tx, c], i) => (
              <span className="ab-w" key={i}>
                <motion.span key={lang} className={c} initial={{ y: '110%' }} animate={inView ? { y: 0 } : { y: '110%' }} transition={{ duration: 0.95, delay: 0.1 + i * 0.16, ease: [0.22, 1, 0.36, 1] }}>{tx}</motion.span>
              </span>
            ))}
          </h2>
          <Reveal delay={0.4} y={16}><p className="ab-sub">{t('about.sub')} <b>2012</b></p></Reveal>
        </header>

        <Reveal y={40} className="ab-acc">
          {PANELS.map((p, i) => (
            <div key={p.n} className={'ab-pan' + (act === i ? ' on' : '')} onMouseEnter={() => setAct(i)} onClick={() => setAct(i)} tabIndex={0} onFocus={() => setAct(i)}>
              <span className="ab-pn">{p.n}</span>
              <span className="ab-pv">{p.t}</span>
              <div className="ab-pb">
                <div className="ab-ph">{p.ico && <span className="ab-ico">{p.ico}</span>}<h3>{p.t}</h3></div>
                <PanelBody i={i} />
              </div>
            </div>
          ))}
        </Reveal>

        <div className="ab-prov" aria-label={t('about.provAria')}>
          <span className="ab-prov-l"><b>08</b>{t('about.provLabel')}</span>
          <div className="ab-prov-m"><div className="ab-prov-t">
            {[...PROV, ...PROV, ...PROV, ...PROV].map((n, i) => <span key={i}><i />{n}</span>)}
          </div></div>
        </div>

        <Reveal className="ab-quote" y={24}>
          <p>{t('about.q1')} <span className="ab-hl">{t('about.q2')}</span></p>
        </Reveal>
      </div>
    </section>
  )
}

export function Stats() {
  const { t } = useLang()
  const labels = t('stats')
  const STATS = [
    { n: 10000, suffix: '+' }, { n: 166, suffix: '' }, { n: 150, suffix: '+' }, { n: 220, suffix: '' }, { n: 2012, suffix: '', plain: true },
  ].map((s, i) => ({ ...s, label: labels[i] }))
  return (
    <section className="stats">
      <div className="container stats-grid">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="stat">
            <strong><Counter to={s.n} suffix={s.suffix} plain={s.plain} /></strong>
            <span>{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const SV_ICONS = [
  <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  <><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01" /><path d="M17.3 5H6.7a4 4 0 0 0-3.9 3.1l-1.5 7A3 3 0 0 0 4.2 19c1 0 1.9-.6 2.4-1.5L8 15h8l1.4 2.5c.5.9 1.4 1.5 2.4 1.5a3 3 0 0 0 2.9-3.9l-1.5-7A4 4 0 0 0 17.3 5z" /></>,
  <path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" />,
  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />,
  <><circle cx="12" cy="12" r="10" /><path d="m10 8 6 4-6 4z" /></>,
  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
]
const SvIco = ({ i }) => (
  <span className="sv-ico"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{SV_ICONS[i]}</svg></span>
)
const SV_THEME = [
  ['#ff3b47', '#7a0610'], ['#7c5cff', '#160f4a'], ['#ff9d2e', '#b5113f'],
  ['#2f8bff', '#0a1b52'], ['#ff3d95', '#32094f'], ['#f5c451', '#2b1d03'],
]
const SV_IMGS = ['/images/card-40000.webp', '/images/services/games.jpg', '/images/services/gifts.jpg', '/images/services/shopping.jpg', '/images/services/games2.jpg', '/images/services/charge2.png']
/* تحسين مسبق لكل الصور مرة واحدة، حتى تظهر فورًا عند الاختيار */
const ENH_P = {}, ENH_R = {}
const enh = (u) => (ENH_P[u] ||= enhanceImage(u, 1500).then((r) => (ENH_R[u] = r)))
function useEnh(url) {
  const [s, setS] = useState(ENH_R[url] || null)
  useEffect(() => { if (ENH_R[url]) { setS(ENH_R[url]); return } let live = true; enh(url).then((r) => { if (live) setS(r) }); return () => { live = false } }, [url])
  return s
}

/* تصميم خاص لكل بطاقة (SVG 420×266) */
const W = '#fff'
const dots = (pts, r = 3, o = 0.5) => pts.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={r} fill={W} fillOpacity={o} />)
const SV_ART = [
  null,
  /* ألعاب: أرضية نيون منظورية + يد تحكم + بكسلات */
  <>
    <g stroke={W} strokeOpacity=".2" fill="none"><path d="M0 190H420M0 214H420M0 242H420M210 150 20 266M210 150 110 266M210 150V266M210 150 310 266M210 150 400 266" /></g>
    <g transform="translate(212 8) scale(8.2)" stroke={W} strokeOpacity=".3" strokeWidth=".32" fill="none" strokeLinecap="round" strokeLinejoin="round">{SV_ICONS[1]}</g>
    {[[34, 80], [58, 56], [86, 96], [388, 190], [360, 220]].map(([x, y], k) => <rect key={k} x={x} y={y} width="9" height="9" fill={W} fillOpacity={0.22 + k * 0.04} />)}
  </>,
  /* هدايا: شريط وفيونكة + قصاصات */
  <>
    <rect x="188" y="0" width="44" height="266" fill={W} fillOpacity=".13" />
    <rect x="0" y="104" width="420" height="40" fill={W} fillOpacity=".13" />
    <g fill={W} fillOpacity=".2" stroke={W} strokeOpacity=".4"><ellipse cx="172" cy="84" rx="38" ry="20" transform="rotate(-24 172 84)" /><ellipse cx="248" cy="84" rx="38" ry="20" transform="rotate(24 248 84)" /></g>
    <circle cx="210" cy="96" r="12" fill={W} fillOpacity=".5" />
    {dots([[40, 50], [70, 190], [350, 40], [385, 150], [320, 225], [110, 235], [300, 160], [60, 120]], 3.5, 0.55)}
  </>,
  /* تسوق: خطوط قطرية + حقيبة + باركود */
  <>
    <g stroke={W} strokeOpacity=".1" strokeWidth="14">{[-60, 20, 100, 180, 260, 340, 420].map((x) => <path key={x} d={`M${x} 280 ${x + 150} -20`} />)}</g>
    <g transform="translate(250 22) scale(8)" stroke={W} strokeOpacity=".32" strokeWidth=".3" fill="none" strokeLinecap="round" strokeLinejoin="round">{SV_ICONS[3]}</g>
    <g fill={W} fillOpacity=".5">{[0, 4, 7, 12, 15, 19, 22, 28, 31, 35, 40, 43].map((x, k) => <rect key={k} x={26 + x * 1.7} y="196" width={k % 3 ? 2 : 4} height="34" />)}</g>
  </>,
  /* ترفيه: شريط فيلم + زر تشغيل */
  <>
    <g fill={W} fillOpacity=".24">{Array.from({ length: 15 }, (_, k) => <rect key={k} x={10 + k * 28} y="9" width="14" height="9" rx="2.5" />)}{Array.from({ length: 15 }, (_, k) => <rect key={'b' + k} x={10 + k * 28} y="248" width="14" height="9" rx="2.5" />)}</g>
    <circle cx="300" cy="132" r="92" fill={W} fillOpacity=".07" />
    <circle cx="300" cy="132" r="70" fill="none" stroke={W} strokeOpacity=".3" />
    <path d="M280 98 340 132 280 166Z" fill={W} fillOpacity=".38" />
    <path d="M30 150H110M30 170H80" stroke={W} strokeOpacity=".2" strokeWidth="4" strokeLinecap="round" />
  </>,
  /* موزعون: شبكة عقد ذهبية */
  <>
    <g stroke={W} strokeOpacity=".28" fill="none"><path d="M300 133 230 60M300 133 380 70M300 133 370 200M300 133 240 205M230 60 380 70M370 200 240 205" /></g>
    {[[300, 133, 12], [230, 60, 7], [380, 70, 7], [370, 200, 7], [240, 205, 7]].map(([x, y, r], k) => <circle key={k} cx={x} cy={y} r={r} fill={W} fillOpacity={k ? 0.38 : 0.6} />)}
    <circle cx="300" cy="133" r="30" fill="none" stroke={W} strokeOpacity=".3" /><circle cx="300" cy="133" r="52" fill="none" stroke={W} strokeOpacity=".16" strokeDasharray="3 5" />
  </>,
]

/* بطاقة مخصصة لكل خدمة: تصميم + ألوان + صورة حقيقية إن وُجدت */
function SvCardFace({ i, title }) {
  const { t } = useLang()
  const [a, b] = SV_THEME[i]
  const src = useEnh(SV_IMGS[i])
  const real = true
  return (
    <div className={'svc-face' + (real ? ' real' : '')} style={{ '--ca': a, '--cb': b }}>
      {src ? <img className="svc-img" src={src} alt="" draggable="false" /> : <span className="svc-load" />}
      {SV_ART[i] && <svg className="svc-art" viewBox="0 0 420 266" preserveAspectRatio="xMidYMid slice" aria-hidden>{SV_ART[i]}</svg>}
      <span className="svc-shine" />
      <div className="svc-top">
        <span className="svc-brand">MASAL</span>
        <span className="svc-chip" />
      </div>
      <div className="svc-bot">
        <span className="svc-ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{SV_ICONS[i]}</svg></span>
        <b>{title}</b>
        {t('svc.amt')[i] && <em className="svc-amt">{t('svc.amt')[i]}</em>}
      </div>
    </div>
  )
}

export function Services() {
  const { t, arrow } = useLang()
  const SERVICES = t('svc.list')
  const n = SERVICES.length
  const [act, setAct] = useState(0)
  const [hold, setHold] = useState(false)
  useEffect(() => { SV_IMGS.forEach(enh) }, [])
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  useEffect(() => {
    if (hold) return
    const id = setTimeout(() => setAct((a) => (a + 1) % n), 4500)
    return () => clearTimeout(id)
  }, [act, hold, n])
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 })
  }
  const [a, b] = SV_THEME[act]
  return (
    <section className="sec sv-sec" id="services">
      <div className="sv-bg" aria-hidden />
      <div className="container">
        <Head kicker={t('svc.kicker')} title={t('svc.title')} text={t('svc.text')} />
        <div className="sv-show" style={{ '--ca': a, '--cb': b }}>
          <ul className="sv-list" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
            {SERVICES.map((s, i) => (
              <motion.li key={s.title} className={i === act ? 'on' : ''} onMouseEnter={() => setAct(i)} onClick={() => setAct(i)}
                initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}>
                <span className="sv-li-n">{String(i + 1).padStart(2, '0')}</span>
                <div className="sv-li-b">
                  <h3>{s.title}</h3>
                  <div className="sv-li-d"><p>{s.text}</p></div>
                </div>
                <span className="sv-li-a"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></span>
                {i === act && !hold && <i className="sv-li-p" key={act} />}
              </motion.li>
            ))}
          </ul>

          <div className="sv-stage2" onMouseMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0 })} onMouseEnter={() => setHold(true)} onMouseOut={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHold(false) }}>
            <i className="sv-glow" aria-hidden />
            <i className="sv-floor" aria-hidden />
            <div className="sv-3d" style={{ transform: `rotateY(${tilt.x * 12}deg) rotateX(${-tilt.y * 10}deg)` }}>
              <div className="sv-back b2" /><div className="sv-back b1" />
              <AnimatePresence mode="wait">
                <motion.div key={act} className="sv-card"
                  initial={{ opacity: 0, rotateY: 70, x: -80, scale: 0.88 }} animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }} exit={{ opacity: 0, rotateY: -70, x: 80, scale: 0.88 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
                  <SvCardFace i={act} title={SERVICES[act].title} />
                </motion.div>
              </AnimatePresence>
            </div>
            <span className="sv-badge b-a">{t('svc.badges')[act]}</span>
            <span className="sv-badge b-b">{t('svc.genuine')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===== قوس الشعارات: بلاطات حمراء بشعارات سوداء حول العنوان ===== */
const TXT = {
  asiacell: <text x="12" y="14.6" textAnchor="middle" fontSize="6.6" fontWeight="900" fontStyle="italic" fontFamily="Arial Black, Arial, sans-serif">Asiacell</text>,
  disney: <text x="12" y="14.4" textAnchor="middle" fontSize="6.4" fontWeight="700" fontStyle="italic" fontFamily="Georgia, serif">Disney+</text>,
  fortnite: <text x="12" y="14.2" textAnchor="middle" fontSize="4.8" fontWeight="900" fontStyle="italic" fontFamily="Arial Black, Arial, sans-serif" letterSpacing=".2">FORTNITE</text>,
  apex: <path d="M12 3 3 21h4.2L12 11.6 16.8 21H21L12 3zm0 9.5L9.6 17h4.8L12 12.5z" />,
  codm: <path d="M3.5 18V6.5l4.2 6.2L12 6.5l4.3 6.2 4.2-6.2V18h-3v-6l-4.2 6.1L12 14.9l-1.3 3.2L7.5 12v6z" />,
}
const BRANDS = [
  // [x, y, شعار]   إحداثيات على مساحة 1440×680
  [180, 116, 'appstore'], [180, 256, 'amazon'], [190, 396, 'spotify'], [316, 190, 'googleplay'], [306, 348, 'pubg'], [314, 460, 'codm'],
  [454, 275, 'xbox'], [454, 427, 'playstation'], [439, 539, 'steam'],
  [579, 328, 'asiacell'], [579, 470, 'netflix'], [578, 580, 'disney'],
  [723, 310, 'paramountplus'], [723, 449, 'epicgames'], [723, 577, 'tiktok'],
  [856, 328, 'facebook'], [854, 472, 'ea'], [873, 587, 'twitch'],
  [984, 420, 'fortnite'], [997, 277, 'roblox'], [1005, 520, 'razer'],
  [1111, 347, 'appletv'], [1146, 465, 'appstore'], [1119, 198, 'nintendoswitch'],
  [1257, 116, 'apex'], [1260, 263, 'xbox'], [1239, 390, 'spotify'],
]

function BrandMark({ k }) {
  const isTxt = k in TXT
  return (
    <svg viewBox="0 0 24 24" className="bw-ico" aria-hidden>
      {isTxt ? (k === 'apex' || k === 'codm' ? <g className="bw-fill">{TXT[k]}</g> : <g className="bw-txt">{TXT[k]}</g>) : <path className="bw-fill" d={LOGO[k]} />}
    </svg>
  )
}

export function Values() {
  const { t } = useLang()
  const VALUES = t('values')
  const wrap = useRef(null)
  const onMove = (e) => {
    const r = wrap.current.getBoundingClientRect()
    wrap.current.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    wrap.current.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  return (
    <section className="sec bw-sec" id="values">
      <div className="container">
        <div className="bw" ref={wrap} onMouseMove={onMove} onMouseLeave={() => { wrap.current.style.setProperty('--px', 0); wrap.current.style.setProperty('--py', 0) }}>
          <i className="bw-corner l" aria-hidden /><i className="bw-corner r" aria-hidden />
          <svg className="bw-arcs" viewBox="0 0 1440 680" preserveAspectRatio="none" aria-hidden>
            <ellipse cx="720" cy="300" rx="600" ry="380" /><ellipse cx="720" cy="300" rx="470" ry="290" /><ellipse cx="720" cy="300" rx="340" ry="200" />
          </svg>
          <Reveal className="bw-head">
            <span className="bw-pill">{t('bw.pill')}</span>
            <h2>{t('bw.h1')} <br />{t('bw.h2')}</h2>
          </Reveal>
          {BRANDS.map(([x, y, k], i) => (
            <motion.span key={i} className={"bw-t" + (k === "asiacell" ? " hot" : "")} style={{ left: `${(x / 1440) * 100}%`, top: `${(y / 680) * 100}%`, '--d': 0.4 + (i % 5) * 0.25, animationDelay: `${(i % 7) * -0.9}s` }}
              initial={{ opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.1 + i * 0.035 }}>
              <span className="bw-in"><BrandMark k={k} /></span>
            </motion.span>
          ))}
        </div>
        <ul className="bw-vals">
          {VALUES.map((v) => <li key={v.title}><b>{v.title}</b><span>{v.text}</span></li>)}
        </ul>
      </div>
    </section>
  )
}

/* بكسلات تتوهج وتتحرك من الجانبين وتخفت نحو الوسط */
function FinPixels() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    const S = 10, G = 2 // حجم الخلية والفراغ
    let W = 0, H = 0, cols = 0, rows = 0, hash = [], raf = 0, vis = true
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = c.clientWidth; H = c.clientHeight
      c.width = W * dpr; c.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(W / S); rows = Math.ceil(H / S)
      hash = Array.from({ length: cols * rows }, () => Math.random())
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(c)
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting }); io.observe(c)
    const light = () => document.documentElement.dataset.theme === 'light'
    const frame = (ms) => {
      raf = requestAnimationFrame(frame)
      if (!vis) return
      const t = ms / 1000
      ctx.clearRect(0, 0, W, H)
      const reach = Math.min(W * 0.34, 560)
      const col = light() ? '229,9,20' : '255,70,80'
      const boost = light() ? 1.15 : 1
      for (let i = 0; i < cols; i++) {
        const x = i * S
        const d = Math.min(x, W - x - S) // البعد عن أقرب حافة
        if (d > reach) continue
        const fade = Math.pow(1 - d / reach, 1.7)
        for (let j = 0; j < rows; j++) {
          const h = hash[i * rows + j]
          // موجة قطرية تسري + وميض فردي لكل بكسل
          const wave = 0.5 + 0.5 * Math.sin(t * 1.1 - (i + j) * 0.22 + h * 6.28)
          const tw = 0.5 + 0.5 * Math.sin(t * (1.2 + h * 2.2) + h * 40)
          const v = wave * 0.65 + tw * 0.35
          if (h > 0.18 + fade * 0.72) continue // الكثافة تقل نحو الوسط
          const a = fade * Math.max(0, v - 0.28) * 0.5 * boost
          if (a < 0.03) continue
          ctx.fillStyle = `rgba(${col},${Math.min(a, 0.32).toFixed(3)})`
          ctx.fillRect(x + G / 2, j * S + G / 2, S - G, S - G)
        }
      }
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [])
  return <canvas ref={ref} className="fin-px" aria-hidden />
}

export function CTA() {
  const { t, arrow } = useLang()
  const links = [[t('nav.about'), '#about'], [t('nav.services'), '#services'], [t('nav.gallery'), '#gallery'], [t('nav.brands'), '#values']]
  return (
    <footer className="fin" id="join">
      <div className="fin-bg" aria-hidden>
        <i className="fin-glow" /><i className="fin-grid" /><span className="fin-wm">MASAL</span>
        <FinPixels />
      </div>
      <div className="container fin-in">
        <Reveal className="fin-top" y={34}>
          <span className="fin-pill"><i />{t('fin.pill')}</span>
          <h2>{t('fin.h2a')} <span>{t('fin.h2b')}</span> {t('fin.h2c')}</h2>
          <p>{t('fin.p')}</p>
          <div className="fin-btns">
            <a href="#top" className="fin-btn main"><span>{t('fin.contact')}</span><em>{arrow}</em></a>
            <a href="#services" className="fin-btn ghost">{t('fin.browse')}</a>
          </div>
        </Reveal>
        <div className="fin-bar">
          <div className="fin-brand"><img src="/images/logo.png" alt="" width="42" height="42" /><div><b>{t('brand')}</b><small>{t('fin.tag')}</small></div></div>
          <nav className="fin-nav">{links.map(([tx, h]) => <a key={h} href={h}>{tx}</a>)}</nav>
          <small className="fin-copy">© {new Date().getFullYear()} {t('fin.copy')}</small>
        </div>
      </div>
    </footer>
  )
}

