import Hero from './sections/Hero'
import Services from './sections/Services'
import HowWeWork from './sections/HowWeWork'
import Portfolio from './sections/Portfolio'
import Russia from './sections/Russia'
import About from './sections/About'
import Fears from './sections/Fears'
import Blog from './sections/Blog'
import Calculator from '../../features/Calculator'
import FAQ from './sections/FAQ'
import Reviews from '../../features/Reviews'
import Contacts from './sections/Contacts'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <HowWeWork />
      <Portfolio />
      <Russia />
      <About />
      <Fears />
      <Blog />
      <Calculator />
      <FAQ />
      <Reviews />
      <Contacts />
    </>
  )
}
