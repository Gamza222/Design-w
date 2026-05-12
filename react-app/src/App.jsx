import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Russia from './components/Russia'
import About from './components/About'
import Fears from './components/Fears'
import Blog from './components/Blog'
import Calculator from './components/Calculator'
import Reviews from './components/Reviews'
import Contacts from './components/Contacts'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Russia />
        <About />
        <Fears />
        <Blog />
        <Calculator />
        <Reviews />
        <Contacts />
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
