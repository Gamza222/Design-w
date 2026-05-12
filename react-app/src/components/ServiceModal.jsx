import { useState } from 'react'

export default function ServiceModal({ service, onClose }) {
  if (!service) return null

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#1E2240] border border-[rgba(201,169,122,0.2)] rounded-3xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
        {/* Закрыть */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(201,169,122,0.1)] text-[rgba(232,228,220,0.6)] hover:text-[#C9A97A] transition-all text-lg"
        >
          ✕
        </button>

        <span className="text-4xl font-bold text-[rgba(201,169,122,0.2)]">{service.num}</span>
        <h3 className="text-xl font-bold text-[#E8E4DC] mt-2 mb-1">{service.title}</h3>
        <p className="text-[#C9A97A] font-semibold mb-5">{service.price}</p>

        <ul className="space-y-2.5 mb-6">
          {service.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[rgba(232,228,220,0.8)] text-sm">
              <span className="text-[#C9A97A] mt-0.5 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>

        {service.disclaimer && (
          <p className="text-[rgba(232,228,220,0.4)] text-xs italic mb-5 border-t border-[rgba(201,169,122,0.1)] pt-4">
            {service.disclaimer}
          </p>
        )}

        <a
          href="#contacts"
          onClick={onClose}
          className="btn-gold w-full justify-center"
        >
          {service.btnText}
        </a>
      </div>
    </div>
  )
}
