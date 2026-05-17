import { Link } from 'react-router-dom'
import { blogPosts } from '../../../shared/data/content'
import FadeInView from '../../../shared/ui/FadeInView'

// Показываем только 3 последних поста
const displayPosts = blogPosts.slice(0, 3)

const tagColors = {
  Советы: 'bg-blue-50 text-blue-700',
  Ошибки: 'bg-red-50 text-red-700',
  Цены: 'bg-amber-50 text-amber-700',
  Лайфхаки: 'bg-green-50 text-green-700',
  Процесс: 'bg-purple-50 text-purple-700',
}

export default function Blog() {
  return (
    <section className="py-24 bg-[#1C2340]" id="blog">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="section-tag">Блог и обзоры</p>
            <h2 className="section-title">Делимся опытом и вдохновением</h2>
            <p className="section-sub">Полезные статьи о дизайне интерьера из реальной практики</p>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPosts.map((post, i) => (
            <FadeInView key={post.id} delay={i * 0.1}>
              <article className="bg-[#1E2240] border border-[rgba(254,193,4,0.1)] rounded-2xl overflow-hidden hover:border-[rgba(254,193,4,0.3)] hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                {/* Изображение-заглушка */}
                <Link to={`/blog/${post.slug}`} className="block relative h-44 overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2A3560] to-[#1E2240]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-[rgba(254,193,4,0.15)]">
                      {String(post.id).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 z-20 text-[10px] font-semibold text-[#FEC104] bg-[rgba(26,26,46,0.85)] backdrop-blur-sm px-3 py-1 rounded-full border border-[rgba(254,193,4,0.2)]">
                    {post.tag}
                  </span>
                </Link>

                {/* Контент */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[rgba(232,228,220,0.4)] text-xs mb-3">
                    <time>{post.date}</time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-[#E8E4DC] font-semibold text-sm mb-2 leading-snug group-hover:text-[#FEC104] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[rgba(232,228,220,0.55)] text-xs leading-relaxed mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-1.5 text-[#FEC104] text-xs font-medium hover:text-[#F5B800] transition-colors mt-auto"
                  >
                    Читать статью
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </article>
            </FadeInView>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/blog" className="btn-gold">Смотреть все статьи</Link>
        </div>
      </div>
    </section>
  )
}
