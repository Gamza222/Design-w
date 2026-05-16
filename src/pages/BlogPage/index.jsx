import { Link } from 'react-router-dom'
import { blogPosts } from '../../shared/data/content'
import FadeInView from '../../shared/ui/FadeInView'

const tagColors = {
  Советы: 'text-blue-600 bg-blue-50',
  Ошибки: 'text-red-600 bg-red-50',
  Цены: 'text-amber-700 bg-amber-50',
  Лайфхаки: 'text-green-700 bg-green-50',
  Процесс: 'text-purple-700 bg-purple-50',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] pt-24 pb-16">
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[rgba(28,35,64,0.4)] mb-8">
          <Link to="/" className="hover:text-[#C9A97A] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-[#C9A97A]">Блог</span>
        </div>

        <FadeInView>
          <p className="section-tag-dark">Блог и обзоры</p>
          <h1 className="section-title-dark mb-4">Делимся опытом и вдохновением</h1>
          <p className="text-[rgba(28,35,64,0.6)] mb-12">
            Полезные статьи о дизайне интерьера из реальной практики нашей студии
          </p>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <FadeInView key={post.id} delay={i * 0.07}>
              <article className="bg-white border border-[rgba(201,169,122,0.15)] rounded-2xl overflow-hidden hover:border-[rgba(201,169,122,0.4)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col">
                {/* Обложка */}
                <Link to={`/blog/${post.slug}`} className="block relative h-44 overflow-hidden bg-gradient-to-br from-[#2A3560] to-[#1E2240] shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-[rgba(201,169,122,0.2)]">
                      {String(post.id).padStart(2, '0')}
                    </span>
                  </div>
                  <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${tagColors[post.tag] || 'text-[#C9A97A] bg-[rgba(201,169,122,0.1)]'}`}>
                    {post.tag}
                  </span>
                </Link>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[rgba(28,35,64,0.4)] text-xs mb-3">
                    <time>{post.date}</time>
                    <span>·</span>
                    <span>{post.readTime} чтения</span>
                  </div>
                  <h2 className="text-[#1C2340] font-semibold text-sm mb-2 leading-snug group-hover:text-[#C9A97A] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[rgba(28,35,64,0.55)] text-xs leading-relaxed mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-1.5 text-[#C9A97A] text-xs font-semibold hover:text-[#B8852E] transition-colors mt-auto"
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

        {/* CTA */}
        <FadeInView delay={0.4} className="text-center mt-16">
          <div className="bg-white border border-[rgba(201,169,122,0.2)] rounded-3xl p-10 max-w-xl mx-auto shadow-sm">
            <h2 className="text-xl font-bold text-[#1C2340] mb-3">Готовы обсудить ваш проект?</h2>
            <p className="text-[rgba(28,35,64,0.6)] text-sm mb-6">
              Рассчитаем стоимость и расскажем, что подойдёт именно вам.
            </p>
            <Link to="/#price" className="btn-gold">Рассчитать стоимость</Link>
          </div>
        </FadeInView>
      </div>
    </div>
  )
}
