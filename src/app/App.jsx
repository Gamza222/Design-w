import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from '../widgets/Header'
import Footer from '../widgets/Footer'
import CookieBanner from '../widgets/CookieBanner'
import HomePage from '../pages/HomePage'
import PortfolioPage from '../pages/PortfolioPage'
import ProjectPage from '../pages/ProjectPage'
import BlogPage from '../pages/BlogPage'
import ArticlePage from '../pages/ArticlePage'
import ServicesPage from '../pages/ServicesPage'
import AboutPage from '../pages/AboutPage'
import ContactsPage from '../pages/ContactsPage'
import ReviewsPage from '../pages/ReviewsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/services"          element={<ServicesPage />} />
          <Route path="/about"             element={<AboutPage />} />
          <Route path="/portfolio"         element={<PortfolioPage />} />
          <Route path="/portfolio/:slug"   element={<ProjectPage />} />
          <Route path="/blog"              element={<BlogPage />} />
          <Route path="/blog/:id"          element={<ArticlePage />} />
          <Route path="/contacts"          element={<ContactsPage />} />
          <Route path="/reviews"           element={<ReviewsPage />} />
          {/* Fallback */}
          <Route path="*"                  element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </BrowserRouter>
  )
}
