import FadeInView from '../../../shared/ui/FadeInView'

export default function Russia() {
  const stats = [
    { num: '50+', label: 'городов России и СНГ' },
    { num: '100%', label: 'онлайн — без привязки к региону' },
    { num: '24/7', label: 'всегда на связи' },
    { num: '0 ₽', label: 'первая консультация' },
  ]

  const routes = [
    { id: 'r1', d: 'M 230,215 Q 500,120 870,290', dur: '7s', begin: '0s' },
    { id: 'r2', d: 'M 225,210 Q 370,160 570,215', dur: '4.5s', begin: '1.5s' },
    { id: 'r3', d: 'M 220,215 Q 195,270 205,320', dur: '3s', begin: '0.8s' },
    { id: 'r4', d: 'M 228,212 Q 310,185 400,205', dur: '3.5s', begin: '2.2s' },
    { id: 'r5', d: 'M 230,213 Q 430,150 660,195', dur: '5.5s', begin: '3s' },
  ]

  return (
    <section className="py-20 bg-[#243050]" id="russia">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-10">
            <p className="section-tag">География</p>
            <h2 className="section-title">Работаем по всей России</h2>
            <p className="section-sub">Онлайн-формат позволяет нам создавать дизайн-проекты для клиентов из любого города</p>
          </div>
        </FadeInView>
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4">
        <img
          src="/russia-map.png"
          alt="Карта России"
          className="w-full h-auto opacity-60"
          loading="lazy"
        />

        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 480"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <g id="plane" fill="#F5B800" opacity="0.95">
              <ellipse cx="4" cy="0" rx="12" ry="2" />
              <path d="M 6,-1.8 L 0,-13 L 4,-13 L 10,-2 Z" />
              <path d="M 6,1.8 L 0,13 L 4,13 L 10,2 Z" />
              <path d="M -6,-2 L -9,-6 L -7,-6 L -4,-2 Z" />
              <path d="M -6,2 L -9,6 L -7,6 L -4,2 Z" />
            </g>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {routes.map((r) => (
            <g key={r.id}>
              <path id={r.id} d={r.d} fill="none" />
              <use href="#plane" filter="url(#glow)">
                <animateMotion dur={r.dur} repeatCount="indefinite" begin={r.begin} rotate="auto">
                  <mpath href={`#${r.id}`} />
                </animateMotion>
              </use>
            </g>
          ))}
        </svg>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4 flex-wrap">
          {stats.map((s) => (
            <div
              key={s.num}
              className="bg-[rgba(26,26,46,0.85)] backdrop-blur-md border border-[rgba(201,169,122,0.2)] rounded-xl px-4 py-3 text-center min-w-[120px]"
            >
              <div className="text-xl font-bold text-[#C9A97A]">{s.num}</div>
              <div className="text-[rgba(232,228,220,0.65)] text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
