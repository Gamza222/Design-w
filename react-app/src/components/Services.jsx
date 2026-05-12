import { useState } from 'react'
import { services } from '../data/services'
import ServiceModal from './ServiceModal'
import FadeInView from './FadeInView'
import { motion } from 'framer-motion'

const WEB3FORMS_KEY = '571ed5f8-bdbc-459e-a3e1-aec1c09223b4'

export default function Services() {
  const [activeModal, setActiveModal] = useState(null)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadAgree, setLeadAgree] = useState(false)
  const [leadStatus, setLeadStatus] = useState('idle')

  const activeService = services.find((s) => s.id === activeModal)

  const submitLead = async (e) => {
    e.preventDefault()
    if (!leadAgree) return
    setLeadStatus('loading')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Запрос консультации с сайта Дизайн Сейчас',
          from_name: 'Сайт Дизайн Сейчас',
          Имя: leadName,
          Телефон: leadPhone,
          Источник: 'Форма «Не знаете что выбрать»',
        }),
      })
      const json = await res.json()
      setLeadStatus(json.success ? 'success' : 'error')
      if (json.success) { setLeadName(''); setLeadPhone(''); setLeadAgree(false) }
    } catch {
      setLeadStatus('error')
    }
  }

  return (
    <section className="py-24 bg-[#16213E]" id="services">
      <div className="container">
        <FadeInView>
          <div className="mb-12 text-center">
            <p className="section-tag">Наши услуги</p>
            <h2 className="section-title">Дизайн-проект под любую задачу</h2>
            <p className="section-sub">Акцент на эстетике и функциональности</p>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <FadeInView key={s.id} delay={i * 0.07}>
              <div
                className="service-card h-full"
                onClick={() => setActiveModal(s.id)}
              >
                <span className="text-4xl font-bold text-[rgba(201,169,122,0.2)] block mb-3">{s.num}</span>
                <h3 className="text-base font-semibold text-[#E8E4DC] mb-2">{s.title}</h3>
                <p className="text-[rgba(232,228,220,0.6)] text-sm leading-relaxed mb-4">{s.short}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(201,169,122,0.1)]">
                  <span className="text-[#C9A97A] font-semibold text-sm">{s.price}</span>
                  <span className="text-[rgba(232,228,220,0.5)] text-xs hover:text-[#C9A97A] transition-colors">
                    Что входит →
                  </span>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>

        {/* CTA — не знаете что выбрать */}
        <FadeInView delay={0.2} className="mt-16">
          <div className="bg-[#1E2240] border border-[rgba(201,169,122,0.15)] rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-[#E8E4DC] mb-2">Не знаете, что выбрать?</h3>
            <p className="text-[rgba(232,228,220,0.6)] mb-6">
              Просто оставьте номер. Дизайнер сам позвонит и поможет разобраться.
            </p>
            <form onSubmit={submitLead} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Ваше имя"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  required
                />
                <input
                  className="form-input"
                  type="tel"
                  placeholder="Телефон"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-[rgba(232,228,220,0.5)] text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={leadAgree}
                  onChange={(e) => setLeadAgree(e.target.checked)}
                  className="accent-[#C9A97A]"
                />
                Я даю согласие на обработку{' '}
                <a href="#" className="text-[#C9A97A] underline">персональных данных</a>
                {' '}согласно ФЗ-152
              </label>
              <button type="submit" className="btn-gold justify-center" disabled={leadStatus === 'loading'}>
                {leadStatus === 'loading' ? 'Отправляем...' : 'Получить консультацию'}
              </button>
              {leadStatus === 'success' && (
                <p className="text-green-400 text-sm">Отлично! Дизайнер позвонит вам в ближайшее время.</p>
              )}
              {leadStatus === 'error' && (
                <p className="text-red-400 text-sm">Не удалось отправить. Напишите нам: dizain.seichas@yandex.ru</p>
              )}
            </form>
          </div>
        </FadeInView>
      </div>

      {/* Модальное окно */}
      {activeModal && (
        <ServiceModal service={activeService} onClose={() => setActiveModal(null)} />
      )}
    </section>
  )
}
