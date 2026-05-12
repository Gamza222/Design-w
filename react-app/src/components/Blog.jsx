import { blogPosts } from '../data/content'
import FadeInView from './FadeInView'

export default function Blog() {
  return (
    <section className="py-24 bg-[#1A1A2E]" id="blog">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="section-tag">Блог и обзоры</p>
            <h2 className="section-title">Делимся опытом и вдохновением</h2>
            <p className="section-sub">Полезные статьи о дизайне интерьера — из реальной практики</p>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <FadeInView key={post.id} delay={i * 0.1}>
              <article
                className="bg-[#1E2240] border border-[rgba(201,169,122,0.1)] rounded-2xl overflow-hidden hover:border-[rgba(201,169,122,0.3)] hover:-translate-y-1 transition-all duration-300 group h-full"
              >
              {/* Изображение */}
              <a href={post.href} className="block relative h-44 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2A3560] to-[#1E2240]" />
                <img
                  src={post.imgSrc}
                  alt={post.imgAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <span className="absolute top-3 left-3 z-20 bg-[rgba(26,26,46,0.85)] backdrop-blur-sm text-[#C9A97A] text-xs font-medium px-3 py-1 rounded-full border border-[rgba(201,169,122,0.2)]">
                  {post.tag}
                </span>
              </a>

              {/* Контент */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-[rgba(232,228,220,0.4)] text-xs mb-3">
                  <time>{post.date}</time>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-[#E8E4DC] font-semibold text-sm mb-2 leading-snug group-hover:text-[#C9A97A] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[rgba(232,228,220,0.55)] text-xs leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <a href={post.href} className="flex items-center gap-1.5 text-[#C9A97A] text-xs font-medium hover:text-[#F5B800] transition-colors">
                  Читать статью
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
              </article>
            </FadeInView>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="blog.html" className="btn-gold">Смотреть все статьи →</a>
        </div>
      </div>
    </section>
  )
}
