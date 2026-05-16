import { Link } from 'react-router-dom'
import { blogPosts } from '../../../shared/data/content'
import FadeInView from '../../../shared/ui/FadeInView'

const DISPLAY = blogPosts.slice(0, 3)

const TAG_COLORS = {
  Советы:  { bg: '#E8F8F8', color: '#1C7A78' },
  Ошибки:  { bg: '#FDE8E8', color: '#C0392B' },
  Цены:    { bg: '#FFF3CD', color: '#856404' },
  Лайфхаки:{ bg: '#E8F5E9', color: '#2E7D32' },
  Процесс: { bg: '#EDE7F6', color: '#4527A0' },
}

export default function Blog() {
  return (
    <section className="py-24" style={{ background: '#1C2340' }} id="blog">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="section-tag">Блог</p>
            <h2 className="section-title">Делимся опытом</h2>
            <p className="section-sub mx-auto">Полезные статьи из реальной практики студии</p>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DISPLAY.map((post, i) => {
            const tagStyle = TAG_COLORS[post.tag] || { bg: 'rgba(255,255,255,0.1)', color: '#8BDFDD' }
            return (
              <FadeInView key={post.id} delay={i * 0.1}>
                <article
                  className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 group"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(139,223,221,0.4)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                >
                  {/* Обложка */}
                  <Link to={`/blog/${post.slug}`} className="block relative h-44 overflow-hidden shrink-0"
                    style={{ background: 'linear-gradient(135deg, #243050, #1C2340)' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-bold" style={{ color: 'rgba(255,255,255,0.06)' }}>
                        {String(post.id).padStart(2, '0')}
                      </span>
                    </div>
                    <span
                      className="absolute top-3 left-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: tagStyle.bg, color: tagStyle.color }}
                    >
                      {post.tag}
                    </span>
                  </Link>

                  {/* Контент */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-white/35 text-xs mb-3">
                      <time>{post.date}</time>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-white text-sm font-semibold mb-2 leading-snug group-hover:text-[#8BDFDD] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white/50 text-xs leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-colors mt-auto"
                      style={{ color: '#8BDFDD' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#FFE394' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#8BDFDD' }}
                    >
                      Читать статью
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                </article>
              </FadeInView>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/blog" className="btn-teal">Смотреть все статьи</Link>
        </div>
      </div>
    </section>
  )
}
