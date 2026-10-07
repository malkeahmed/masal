import { CursorGlow } from './components/Fx.jsx'
import Navbar from './components/Navbar.jsx'
import BackToTop from './components/BackToTop.jsx'
import Hero from './components/Hero.jsx'
import { Gallery } from './components/Showcase.jsx'
import { MarqueeX, About, Stats, Services, Values, CTA } from './components/Sections.jsx'

export default function App() {
  return (
    <>
      <CursorGlow /><div className="noise" />
      <Navbar />
      <Hero />
      <MarqueeX />
      <About />
      <Stats />
      <Services />
      <Gallery />
      <Values />
      <CTA />
      <BackToTop />
    </>
  )
}
