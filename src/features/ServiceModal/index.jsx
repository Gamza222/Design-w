export default function ServiceModal({ service, onClose }) {
  if (!service) return null
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="relative rounded-3xl p-7 w-full max-w-lg max-h-[85vh] overflow-y-auto"
        style={{ background: '#FFFFFF', border: '2px solid rgba(139,223,221,0.3)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl transition-all"
          style={{ background: 'rgba(26,18,11,0.07)', color: '#1A120B' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,143,104,0.15)'; e.currentTarget.style.color = '#F48F68' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(26,18,11,0.07)'; e.currentTarget.style.color = '#1A120B' }}
          aria-label="Закрыть"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        <span className="text-4xl font-bold block mb-2" style={{ color: 'rgba(244,143,104,0.2)' }}>{service.num}</span>
        <h2 className="text-xl font-bold text-[#1A120B] mb-1">{service.title}</h2>
        <p className="text-sm font-semibold mb-4" style={{ color: '#F48F68' }}>{service.price}</p>
        <p className="text-sm text-[#1A120B]/65 mb-5 leading-relaxed">{service.description || service.short}</p>

        {service.includes && service.includes.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold text-[#1A120B]/50 uppercase tracking-wider mb-3">Что входит</p>
            <ul className="space-y-2">
              {service.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#1A120B]/75">
                  <span className="mt-1 w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-white text-[10px]"
                    style={{ background: '#8BDFDD' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <a href="/#contacts" onClick={onClose} className="btn-coral w-full justify-center">
          Заказать этот пакет
        </a>
      </div>
    </div>
  )
}
