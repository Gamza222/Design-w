import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from '../widgets/Header'
import Footer from '../widgets/Footer'
import CookieBanner from '../widgets/CookieBanner'
import HomePage from '../pages/HomePage'
import PortfolioPage from '../pages/PortfolioPage'
import BlogPage from '../pages/BlogPage'
import ArticlePage from '../pages/ArticlePage'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<ArticlePage />} />
          {/* Fallback — 404 redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </BrowserRouter>
  )
}
