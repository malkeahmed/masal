/* رفع جودة الصور الصغيرة: تكبير بجودة عالية + شحذ خفيف، ثم تُرجع data-URL (الصور الكبيرة تُترك كما هي) */
const load = (src) => new Promise((resolve, reject) => {
  const img = new Image()
  img.onload = () => resolve(img)
  img.onerror = reject
  img.src = src
})

export async function enhanceImage(src, target = 1000) {
  // على الهاتف: أبعاد أصغر = معالجة أسرع وذاكرة أقل
  if (typeof window !== 'undefined' && window.innerWidth < 800) target = Math.round(target * 0.55)
  try {
    const img = await load(src)
    const w = img.naturalWidth, h = img.naturalHeight
    if (w >= target * 0.7) return src
    const k = Math.min(8, Math.ceil(target / w))
    const c = document.createElement('canvas')
    c.width = w * k; c.height = h * k
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    // على مرحلتين: أنعم من قفزة واحدة كبيرة
    let cw = w, ch = h, cur = img
    while (cw * 2 <= c.width) {
      const t = document.createElement('canvas'); t.width = cw * 2; t.height = ch * 2
      const tc = t.getContext('2d'); tc.imageSmoothingQuality = 'high'; tc.drawImage(cur, 0, 0, t.width, t.height)
      cur = t; cw *= 2; ch *= 2
    }
    ctx.drawImage(cur, 0, 0, c.width, c.height)
    // شحذ خفيف (unsharp) لاستعادة حدة الحواف والنصوص
    const id = ctx.getImageData(0, 0, c.width, c.height), d = id.data, W = c.width, H = c.height
    const src2 = new Uint8ClampedArray(d)
    const amt = 0.55
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = (y * W + x) * 4
        for (let ch2 = 0; ch2 < 3; ch2++) {
          const v = src2[i + ch2]
          const n = src2[i - 4 + ch2] + src2[i + 4 + ch2] + src2[i - W * 4 + ch2] + src2[i + W * 4 + ch2]
          d[i + ch2] = v + amt * (4 * v - n) / 2
        }
      }
    }
    ctx.putImageData(id, 0, 0)
    return c.toDataURL('image/webp', 0.94)
  } catch {
    return src
  }
}
