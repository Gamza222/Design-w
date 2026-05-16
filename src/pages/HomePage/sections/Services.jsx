import { useState } from 'react'
import { services } from '../../../shared/data/services'
import ServiceModal from '../../../features/ServiceModal'
import FadeInView from '../../../shared/ui/FadeInView'

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
    <section className="py-24 bg-[#F7F4EF]" id="services">
      <div className="container">
        <FadeInView>
          <div className="mb-12 text-center">
            <p className="section-tag-dark">Наши услуги</p>
            <h2 className="section-title-dark">Дизайн-проект под любую задачу</h2>
            <p className="section-sub-dark">Акцент на эстетике и функциональности</p>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <FadeInView key={s.id} delay={i * 0.06}>
              <div
                className="service-card-light h-full"
                onClick={() => setActiveModal(s.id)}
              >
                <span className="text-4xl font-bold text-[rgba(201,169,122,0.35)] block mb-3">{s.num}</span>
                <h3 className="text-base font-semibold text-[#1C2340] mb-2">{s.title}</h3>
                <p className="text-[rgba(28,35,64,0.6)] text-sm leading-relaxed mb-4">{s.short}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(201,169,122,0.2)]">
                  <span className="text-[#B8852E] font-semibold text-sm">{s.price}</span>
                  <span className="text-[rgba(28,35,64,0.45)] text-xs hover:text-[#C9A97A] transition-colors">
                    Что входит →
                  </span>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>

        {/* CTA */}
        <FadeInView delay={0.2} className="mt-16">
          <div className="bg-white border border-[rgba(201,169,122,0.25)] rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-[#1C2340] mb-2">Не знаете, что выбрать?</h3>
            <p className="text-[rgba(28,35,64,0.6)] mb-6">
              Просто оставьте номер. Дизайнер позвонит и поможет разобраться.
            </p>
            <form onSubmit={submitLead} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="form-input-light"
                  type="text"
                  placeholder="Ваше имя"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  required
                />
                <input
                  className="form-input-light"
                  type="tel"
                  placeholder="Телефон"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-[rgba(28,35,64,0.5)] text-xs cursor-pointer">
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
                <p className="text-green-600 text-sm">Отлично! Дизайнер позвонит вам в ближайшее время.</p>
              )}
              {leadStatus === 'error' && (
                <p className="text-red-500 text-sm">Не удалось отправить. Напишите нам: dizain.seichas@yandex.ru</p>
              )}
            </form>
          </div>
        </FadeInView>
      </div>

      {activeModal && (
        <ServiceModal service={activeService} onClose={() => setActiveModal(null)} />
      )}
    </section>
  )
}
