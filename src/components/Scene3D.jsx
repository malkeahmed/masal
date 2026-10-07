import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const W = 3.2
const H = W / 1.556
const R = 0.12 // نسبة تدوير الزوايا

/* ---------- textures ---------- */
function roundRectPath(ctx, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(r, 0); ctx.arcTo(w, 0, w, h, r); ctx.arcTo(w, h, 0, h, r); ctx.arcTo(0, h, 0, 0, r); ctx.arcTo(0, 0, w, 0, r)
  ctx.closePath()
}

function makeTexture(draw, w = 1400, h = 900) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')
  ctx.save(); roundRectPath(ctx, w, h, h * R * 0.62); ctx.clip()
  draw(ctx, w, h)
  ctx.restore()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  t.needsUpdate = true
  return t
}

function useImageTexture(src) {
  const [tex, setTex] = useState(null)
  useEffect(() => {
    const img = new Image()
    img.onload = () => setTex(makeTexture((ctx, w, h) => ctx.drawImage(img, 0, 0, w, h)))
    img.src = src
  }, [src])
  return tex
}

/* ---------- كروت مولّدة (تصاميم ماسال) ---------- */
function useGenTexture(kind) {
  const [tex, setTex] = useState(null)
  useEffect(() => {
    let live = true
    ;(document.fonts?.ready || Promise.resolve()).then(() => {
      if (!live) return
      const T = {
        games: { a: '#ff3b47', b: '#7a0008', c: '#2a0206', label: 'بطاقات الألعاب', sub: 'GAMING CARDS', glyph: '◆' },
        gifts: { a: '#1d1d22', b: '#0a0a0c', c: '#4a050b', label: 'كروت الهدايا', sub: 'GIFT CARDS', glyph: '✦' },
        fun: { a: '#e50914', b: '#9c0610', c: '#3a0307', label: 'الترفيه الرقمي', sub: 'DIGITAL ENTERTAINMENT', glyph: '●' },
        topup: { a: '#ff5a3c', b: '#b3101a', c: '#2a0206', label: 'شحن فوري', sub: 'INSTANT TOP-UP', glyph: '▲' },
        vip: { a: '#2b0a0d', b: '#0c0405', c: '#8a0c16', label: 'كروت VIP', sub: 'VIP MEMBERS', glyph: '★' },
        pay: { a: '#ff7a59', b: '#d11a2a', c: '#470510', label: 'الدفع الإلكتروني', sub: 'E-PAYMENT', glyph: '■' },
      }[kind]
      setTex(makeTexture((ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, w, h)
        g.addColorStop(0, T.a); g.addColorStop(0.6, T.b); g.addColorStop(1, T.c)
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
        // أقواس زخرفية
        ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 3
        for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.arc(w * 0.05, h * 1.1, 150 + i * 80, 0, 6.3); ctx.stroke() }
        const r = ctx.createRadialGradient(w * 0.85, h * 0.12, 0, w * 0.85, h * 0.12, w * 0.55)
        r.addColorStop(0, 'rgba(255,255,255,.28)'); r.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = r; ctx.fillRect(0, 0, w, h)
        // رمز كبير شفاف
        ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.font = '900 560px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(T.glyph, w * 0.74, h * 0.82)
        // الشريحة
        const cg = ctx.createLinearGradient(110, 330, 290, 470)
        cg.addColorStop(0, '#ffe3ad'); cg.addColorStop(0.5, '#c98a2a'); cg.addColorStop(1, '#ffd38a')
        ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(110, 330, 190, 140, 24); ctx.fill()
        ctx.strokeStyle = 'rgba(80,40,0,.55)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(140, 360, 130, 80, 12); ctx.stroke()
        // النصوص
        ctx.fillStyle = '#fff'; ctx.direction = 'rtl'; ctx.textAlign = 'right'
        ctx.font = '900 130px Cairo, sans-serif'; ctx.fillText('ماسال', w - 110, 210)
        ctx.font = '800 76px Cairo, sans-serif'; ctx.fillText(T.label, w - 110, h - 190)
        ctx.direction = 'ltr'; ctx.textAlign = 'right'
        ctx.font = '500 36px "Space Grotesk", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(T.sub, w - 110, h - 120)
      }))
    })
    return () => { live = false }
  }, [kind])
  return tex
}

/* ---------- back of card ---------- */
function useBackTexture() {
  const [tex, setTex] = useState(null)
  useEffect(() => {
    let live = true
    ;(document.fonts?.ready || Promise.resolve()).then(() => {
      if (!live) return
      setTex(makeTexture((ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, w, h)
        g.addColorStop(0, '#16161a'); g.addColorStop(0.6, '#07070a'); g.addColorStop(1, '#2a0408')
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#000'; ctx.fillRect(0, 110, w, 130)
        ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.font = '900 520px "Space Grotesk", sans-serif'; ctx.textAlign = 'center'
        ctx.fillText('M', w / 2, h - 120)
      }))
    })
    return () => { live = false }
  }, [])
  return tex
}

function radialTexture(stops) {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const x = c.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128)
  stops.forEach(([o, col]) => g.addColorStop(o, col))
  x.fillStyle = g; x.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

/* ---------- كرت واحد دائمًا في الوسط؛ الكرت التالي يحلّ مكانه بانزلاق على القبة + موجة ضوء ---------- */
const N = 4
const TH_SIDE = 0.95 // زاوية الكرتين الجانبيين على القبة
const CYCLE = 5.6 // ثواني بين كل تبديل
const MOVE = 2.6 // مدة التبديل نفسه
const T0 = 3.4 // أول تبديل بعد انتهاء الدخول
const CENTER_K = 1.32 // تكبير كرت الوسط

// أبعاد القبة + حالة الماوس تُحدَّث من Rig
const layout = { A: 9, B: 8, cs: 1.1, mx: 0, my: 0, baseY: 0 }

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const sstep = (t) => t * t * (3 - 2 * t)
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10) // أنعم من easeInOut العادي
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const easeOutBack = (t) => { const c1 = 1.1, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2) }
const mix = (a, b, t) => a + (b - a) * t

/* خطّ لمعة يمرّ على سطح الكرت (داخل حدوده تمامًا) */
function makeStripe() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 8
  const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 512, 0)
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)')
  x.fillStyle = g; x.fillRect(0, 0, 512, 8)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  t.repeat.set(0.35, 1)
  return t
}

let _halo, _fade
/* تدرّج شفافية للانعكاس: قوي عند حافة الكرت ويتلاشى للأسفل */
function fadeTexture() {
  if (!_fade) {
    const c = document.createElement("canvas"); c.width = 4; c.height = 128
    const x = c.getContext("2d"); const g = x.createLinearGradient(0, 0, 0, 128)
    g.addColorStop(0, "#000"); g.addColorStop(0.55, "#222"); g.addColorStop(1, "#fff")
    x.fillStyle = g; x.fillRect(0, 0, 4, 128)
    _fade = new THREE.CanvasTexture(c)
  }
  return _fade
}
function haloTexture() {
  if (!_halo) _halo = radialTexture([[0, 'rgba(255,150,90,.9)'], [0.4, 'rgba(255,45,58,.4)'], [1, 'rgba(229,9,20,0)']])
  return _halo
}

/* مسار بيضاوي؛ الطول المقطوع يُحسب بجدول ليسهل التوزيع بمسافات متساوية */
const TBL = 240, TH_EXT = 1.5
function buildLayout(vw, vh) {
  const narrow = vw / vh < 2.6 // موبايل: كروت أكبر نسبيًا
  const cs = Math.min((vw * (narrow ? 0.22 : 0.12)) / W, (vh * 0.4) / (H * CENTER_K))
  const A = (vw * (narrow ? 0.33 : 0.22)) / Math.sin(TH_SIDE)
  const B = (vh * 0.25) / (1 - Math.cos(TH_SIDE))
  const ths = new Float32Array(TBL + 1), ss = new Float32Array(TBL + 1)
  for (let i = 1; i <= TBL; i++) {
    const a = ((i - 0.5) / TBL) * TH_EXT, d = TH_EXT / TBL
    ths[i] = (i / TBL) * TH_EXT
    ss[i] = ss[i - 1] + Math.hypot(A * Math.cos(a), B * Math.sin(a)) * d
  }
  const at = (th) => { const k = (th / TH_EXT) * TBL, i0 = Math.floor(k); return ss[i0] + (ss[Math.min(i0 + 1, TBL)] - ss[i0]) * (k - i0) }
  Object.assign(layout, { A, B, cs, ds: at(TH_SIDE), ths, ss })
  return layout
}
function thetaAtS(s) {
  const { ths, ss } = layout
  if (s >= ss[TBL]) return ths[TBL]
  let lo = 0, hi = TBL
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ss[m] <= s) lo = m; else hi = m }
  return ths[lo] + ((s - ss[lo]) / (ss[hi] - ss[lo])) * (ths[hi] - ths[lo])
}
/* موضع على المسار من طول القوس الموقّع (يكمل على المماس خارج الجدول) */
function pathAt(sArc) {
  const { A, B } = layout
  const sgn = Math.sign(sArc) || 1
  const th = sgn * thetaAtS(Math.abs(sArc))
  const extra = Math.max(0, Math.abs(sArc) - layout.ss[TBL])
  const hh = Math.hypot(A * Math.cos(th), B * Math.sin(th)) || 1
  return {
    th,
    x: A * Math.sin(th) + (sgn * extra * (A * Math.cos(th))) / hh,
    y: B * (Math.cos(th) - 1) - (extra * (B * Math.abs(Math.sin(th)))) / hh,
  }
}
/* حالة التبديل: رقم الخطوة + تقدّم ناعم 0..1 + الزمن منذ الوصول */
function swapState(t) {
  const since = t - T0
  if (since < 0) return { phase: 0, fr: 0, age: 99 }
  const step = Math.floor(since / CYCLE), local = since % CYCLE
  const fr = clamp01(local / MOVE)
  return { phase: step + smoother(fr), fr, age: local - MOVE }
}

function FanCard({ index, tex, back }) {
  const ref = useRef()
  const haloRef = useRef()
  const sheenRef = useRef()
  const faceRef = useRef()
  const backRef = useRef()
  const stripe = useMemo(makeStripe, [])
  const halo = useMemo(haloTexture, [])
  const fadeMap = useMemo(fadeTexture, [])
  const reflRef = useRef()
  useFrame((s) => {
    const g = ref.current
    if (!g) return
    const t = s.clock.elapsedTime
    const { A, B, cs, mx, my, ds } = layout
    const { phase, fr, age } = swapState(t)

    // الخانات: -1 يسار، 0 وسط، 1 يمين، 2 مخفي (الكرت الرابع ينتظر دوره)
    const u = ((((index + 1.5 - phase) % N) + N) % N) - 1.5
    const au = Math.abs(u)
    const fade = u < -1 ? 1 - sstep(clamp01((-u - 1) * 2)) : u > 1 ? 1 - sstep(clamp01(u - 1)) : 1
    const c = 1 - sstep(clamp01(au)) // 1 = في الوسط تمامًا

    // دخول أول مرة: كل كرت يرتفع من أسفل بحركة نابضة، الوسط أولًا
    const u0 = ((((index + 1.5) % N) + N) % N) - 1.5
    const k = clamp01((t - (0.4 + Math.min(Math.abs(u0), 2) * 0.28)) / 1.7)
    const rise = easeOutExpo(k), pop = easeOutBack(k)

    const { th, x, y } = pathAt(u * ds)
    const lift = Math.sin(Math.PI * fr) // أثناء التبديل
    const float = Math.sin(t * 0.9 + index * 1.7) * 0.08 * cs + Math.sin(t * 0.47 + index * 2.3) * 0.04 * cs
    const arrive = au < 0.6 ? Math.exp(-Math.max(age, 0) * 3.2) * (1 - au / 0.6) : 0 // نبضة عند الوصول

    g.position.x = x + mx * 0.4 * (0.5 + c)
    g.position.y = y + float + c * 0.12 * cs - (1 - rise) * 2.6 * cs
    g.position.z = mix(-0.2, 1.4, c) - Math.max(au - 1, 0) * 1.6 + lift * (u > 0 && u < 1.2 ? 0.8 : 0)
    // الوسط مستقيم تمامًا، والجانبيان يميلان مع القبة ويلتفتان نحو الوسط
    g.rotation.z = -Math.atan((B / A) * Math.tan(th)) * 0.75 + Math.sin(t * 0.6 + index) * 0.012
    // الكرت القادم للوسط يدور دورة كاملة بنعومة ويستقر وهو يتباطأ
    const sp = u > 0 ? clamp01(1 - u) : 0
    g.rotation.y = -u * 0.3 + mx * 0.18 + (1 - rise) * 1.2 * (Math.sign(u) || 1) + Math.PI * 2 * smoother(sp) + Math.sin(t * 0.5) * 0.05 * c
    g.rotation.x = my * (0.09 + 0.12 * c) - lift * 0.07 * (1 - au * 0.4) + Math.sin(t * 0.8 + index * 1.3) * 0.02 + Math.sin(t * 0.42) * 0.025 * c
    const sc = cs * mix(CENTER_K, 0.9, sstep(clamp01(au))) * (1 + 0.05 * arrive + 0.06 * Math.sin(Math.PI * sp)) * (0.6 + 0.4 * pop) * mix(1, 0.86, clamp01(au - 1))
    g.scale.setScalar(Math.max(sc * mix(0.001, 1, fade), 0.0001))
    g.visible = k > 0 && fade > 0.01

    if (faceRef.current) { faceRef.current.material.color.setScalar(mix(0.66, 1, c)); faceRef.current.material.opacity = rise * fade }
    if (backRef.current) backRef.current.material.opacity = rise * fade
    if (reflRef.current) reflRef.current.material.opacity = 0.3 * (0.35 + 0.65 * c) * rise * fade * Math.max(0, Math.cos(g.rotation.y))
    if (haloRef.current) {
      haloRef.current.material.opacity = (0.02 + 0.2 * c + 0.12 * arrive) * rise * fade
      haloRef.current.scale.set(W * (1.15 + 0.2 * c), H * (1.4 + 0.25 * c), 1)
    }
    if (sheenRef.current) {
      // لمعة تعبر الكرت وهو يدخل الوسط
      const p = u > 0 && u < 1 ? 1 - u : 0
      stripe.offset.x = 1.1 - 1.6 * p
      sheenRef.current.material.opacity = p > 0 ? 0.6 * Math.sin(Math.PI * p) : 0
    }
  })
  if (!tex || !back) return null
  return (
    <group ref={ref}>
      <mesh ref={haloRef} position={[0, 0, -0.12]} scale={[W * 1.35, H * 1.7, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={halo} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={faceRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={tex} transparent alphaTest={0.4} toneMapped={false} />
      </mesh>
      {/* انعكاس أرضي ناعم تحت الكرت */}
      <mesh ref={reflRef} position={[0, -H - 0.06, 0.005]} scale={[1, -1, 1]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={tex} alphaMap={fadeMap} transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh ref={sheenRef} position={[0, 0, 0.04]}>
        <planeGeometry args={[W * 0.985, H * 0.985]} />
        <meshBasicMaterial map={stripe} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={backRef} position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={back} transparent alphaTest={0.4} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Rig({ children }) {
  const g = useRef()
  const { viewport } = useThree()
  const vw = viewport.width, vh = viewport.height
  const { cs } = buildLayout(vw, vh)
  const baseY = vh / 2 - cs * H * CENTER_K * 0.8 // كرت الوسط يلامس أعلى المنطقة
  layout.baseY = baseY
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const mv = (e) => { mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2 }
    window.addEventListener('mousemove', mv)
    return () => window.removeEventListener('mousemove', mv)
  }, [])
  useFrame((s, dtRaw) => {
    if (!g.current) return
    const dt = Math.min(dtRaw, 0.05)
    const t = s.clock.elapsedTime
    const k = 1 - Math.exp(-dt * 3) // تنعيم مستقل عن معدل الإطارات
    layout.mx += (mouse.current.x - layout.mx) * k
    layout.my += (mouse.current.y - layout.my) * k
    g.current.rotation.y = Math.sin(t * 0.35) * 0.03
    g.current.position.y += (baseY - g.current.position.y) * (1 - Math.exp(-dt * 5))
  })
  return <group ref={g}>{children}</group>
}

function Cards() {
  const t15 = useImageTexture('/images/card-15000.webp')
  const t40 = useImageTexture('/images/card-40000.webp')
  const games = useGenTexture('games')
  const gifts = useGenTexture('gifts')
  const back = useBackTexture()
  const list = [t40, games, t15, gifts]
  return (
    <Rig>
      {list.map((tex, i) => <FanCard key={i} index={i} tex={tex} back={back} />)}
    </Rig>
  )
}

export default function Scene3D() {
  return (
    <Canvas className="scene3d" dpr={[1, 1.25]} camera={{ position: [0, 0, 12.5], fov: 34 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}>
      <Suspense fallback={null}>
        <Cards />
        <Sparkles count={24} scale={[34, 8, 6]} size={4} speed={0.4} opacity={0.5} color="#ff4650" />
      </Suspense>
    </Canvas>
  )
}
