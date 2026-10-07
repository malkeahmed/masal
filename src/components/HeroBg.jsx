/* خلفية هادئة: شبكة مربعات دقيقة + خيوط ضوء عمودية بطيئة + توهج خفيف جدًا */
const STREAKS = [
  { left: '8%', h: 150, dur: 9, delay: -2 },
  { left: '23%', h: 110, dur: 12, delay: -7 },
  { left: '40%', h: 170, dur: 10, delay: -4 },
  { left: '60%', h: 130, dur: 13, delay: -9 },
  { left: '77%', h: 160, dur: 11, delay: -1 },
  { left: '92%', h: 120, dur: 14, delay: -6 },
]

export default function HeroBg() {
  return (
    <div className="hbg" aria-hidden>
      <div className="bg-glow" />
      <div className="bg-grid" />
      <div className="bg-streaks">
        {STREAKS.map((s, i) => (
          <i key={i} style={{ left: s.left, height: s.h, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }} />
        ))}
      </div>
      <div className="bg-vignette" />
    </div>
  )
}
