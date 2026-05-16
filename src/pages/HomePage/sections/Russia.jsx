import FadeInView from '../../../shared/ui/FadeInView'

export default function Russia() {
  const STATS = [
    { num: '50+',   label: 'городов России и СНГ' },
    { num: '100%',  label: 'онлайн — без привязки' },
    { num: '24/7',  label: 'всегда на связи' },
    { num: '0 ₽',   label: 'первая консультация' },
  ]

  const ROUTES = [
    { id: 'r1', d: 'M 230,215 Q 500,120 870,290', dur: '7s',   begin: '0s' },
    { id: 'r2', d: 'M 225,210 Q 370,160 570,215', dur: '4.5s', begin: '1.5s' },
    { id: 'r3', d: 'M 220,215 Q 195,270 205,320', dur: '3s',   begin: '0.8s' },
    { id: 'r4', d: 'M 228,212 Q 310,185 400,205', dur: '3.5s', begin: '2.2s' },
    { id: 'r5', d: 'M 230,213 Q 430,150 660,195', dur: '5.5s', begin: '3s' },
  ]

  return (
    <section className="py-20" style={{ background: '#243050' }} id="russia">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-10">
            <p className="section-tag">География</p>
            <h2 className="section-title">Работаем по всей России</h2>
            <p className="section-sub mx-auto">
              Онлайн-формат — дизайн-проекты для клиентов из любого города
            </p>
          </div>
        </FadeInView>
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4">
        <img src="/russia-map.png" alt="Карта России" className="w-full h-auto opacity-50" loading="lazy" />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <g id="plane" fill="#F48F68" opacity="0.9">
              <ellipse cx="4" cy="0" rx="12" ry="2" />
              <path d="M 6,-1.8 L 0,-13 L 4,-13 L 10,-2 Z" />
              <path d="M 6,1.8 L 0,13 L 4,13 L 10,2 Z" />
            </g>
            <filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          {ROUTES.map((r) => (
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

        {/* Статистика */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4 flex-wrap">
          {STATS.map((s) => (
            <div
              key={s.num}
              className="rounded-xl px-4 py-3 text-center min-w-[110px]"
              style={{
                background: 'rgba(28, 35, 64, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(139,223,221,0.2)',
              }}
            >
              <div className="text-xl font-bold" style={{ color: '#FFE394' }}>{s.num}</div>
              <div className="text-white/55 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
