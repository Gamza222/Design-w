import { useParams, Link, Navigate } from 'react-router-dom'
import { blogPosts } from '../../shared/data/content'

export default function ArticlePage() {
  const { id } = useParams()
  const post = blogPosts.find((p) => p.slug === id)

  if (!post) return <Navigate to="/blog" replace />

  return (
    <div className="min-h-screen bg-[#F7F4EF] pt-24 pb-16">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[rgba(28,35,64,0.4)] mb-8">
            <Link to="/" className="hover:text-[#C9A97A] transition-colors">Главная</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-[#C9A97A] transition-colors">Блог</Link>
            <span>/</span>
            <span className="text-[#C9A97A] truncate max-w-[200px]">{post.title}</span>
          </div>

          {/* Назад */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#C9A97A] font-semibold text-sm hover:gap-3 transition-all mb-8"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Все статьи
          </Link>

          {/* Тег и мета */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-[#C9A97A] bg-[rgba(201,169,122,0.1)] px-3 py-1 rounded-full">
              {post.tag}
            </span>
            <span className="text-[rgba(28,35,64,0.4)] text-sm">{post.date}</span>
            <span className="text-[rgba(28,35,64,0.3)] text-xs">·</span>
            <span className="text-[rgba(28,35,64,0.4)] text-sm">{post.readTime} чтения</span>
          </div>

          {/* Заголовок */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C2340] leading-tight mb-8">
            {post.title}
          </h1>

          {/* Обложка-заглушка */}
          <div className="rounded-2xl overflow-hidden mb-10 aspect-[16/7] bg-gradient-to-br from-[#2A3560] to-[#1E2240] flex items-center justify-center">
            <span className="text-8xl font-bold text-[rgba(201,169,122,0.12)]">
              {String(post.id).padStart(2, '0')}
            </span>
          </div>

          {/* Тело статьи */}
          <div className="prose-article">
            {post.body.map((block, i) => {
              if (block.type === 'p') return (
                <p key={i} className="text-[rgba(28,35,64,0.75)] text-base leading-relaxed mb-4">
                  {block.text}
                </p>
              )
              if (block.type === 'h2') return (
                <h2 key={i} className="text-xl font-bold text-[#1C2340] mt-8 mb-3">
                  {block.text}
                </h2>
              )
              if (block.type === 'conclusion') return (
                <div key={i} className="bg-[rgba(201,169,122,0.08)] border-l-4 border-[#C9A97A] rounded-r-2xl px-6 py-5 mt-8 mb-4">
                  <p className="text-[rgba(28,35,64,0.75)] text-base leading-relaxed">
                    <strong className="text-[#1C2340]">Вывод: </strong>{block.text}
                  </p>
                </div>
              )
              return null
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-white border border-[rgba(201,169,122,0.2)] rounded-2xl p-8 text-center shadow-sm">
            <h3 className="text-lg font-bold text-[#1C2340] mb-3">Хотите обсудить ваш проект?</h3>
            <p className="text-[rgba(28,35,64,0.6)] text-sm mb-5">
              Рассчитаем стоимость и расскажем, что подойдёт именно вам.
            </p>
            <Link to="/#contacts" className="btn-gold">Оставить заявку</Link>
          </div>

          {/* Другие статьи */}
          <div className="mt-14">
            <h3 className="text-lg font-bold text-[#1C2340] mb-6">Другие статьи</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blogPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 2)
                .map((other) => (
                  <Link
                    key={other.id}
                    to={`/blog/${other.slug}`}
                    className="flex gap-4 bg-white border border-[rgba(201,169,122,0.12)] rounded-xl p-4 hover:border-[rgba(201,169,122,0.35)] hover:shadow-sm transition-all group"
                  >
                    <div className="shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#2A3560] to-[#1E2240] flex items-center justify-center">
                      <span className="text-lg font-bold text-[rgba(201,169,122,0.3)]">{String(other.id).padStart(2, '0')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#C9A97A] mb-1 block">{other.tag}</span>
                      <h4 className="text-[#1C2340] text-xs font-medium leading-snug group-hover:text-[#C9A97A] transition-colors">
                        {other.title}
                      </h4>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
