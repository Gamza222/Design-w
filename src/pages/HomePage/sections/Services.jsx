import { useState } from 'react'
import { services } from '../../../shared/data/services'
import ServiceModal from '../../../features/ServiceModal'
import FadeInView from '../../../shared/ui/FadeInView'

const WEB3FORMS_KEY = '571ed5f8-bdbc-459e-a3e1-aec1c09223b4'

export default function Services() {
  const [activeModal, setActiveModal] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [status, setStatus] = useState('idle')

  const activeService = services.find((s) => s.id === activeModal)

  const submitLead = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Запрос консультации — Дизайн Сейчас',
          from_name: 'Сайт Дизайн Сейчас',
          Имя: name, Телефон: phone, Источник: 'Секция услуг',
        }),
      })
      const json = await res.json()
      setStatus(json.success ? 'success' : 'error')
      if (json.success) { setName(''); setPhone(''); setAgree(false) }
    } catch { setStatus('error') }
  }

  return (
    <section className="py-24" style={{ background: '#FFF6DE' }} id="services">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="section-tag-light">Наши услуги</p>
            <h2 className="section-title-light">Дизайн-проект под любую задачу</h2>
            <p className="section-sub-light mx-auto">
              Акцент на функциональности и вашем образе жизни
            </p>
          </div>
        </FadeInView>

        {/* Сетка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
          {services.map((s, i) => (
            <FadeInView key={s.id} delay={i * 0.05}>
              <div
                className="card-light h-full flex flex-col"
                onClick={() => setActiveModal(s.id)}
              >
                <span
                  className="text-4xl font-bold block mb-3"
                  style={{ color: 'rgba(244,143,104,0.25)' }}
                >
                  {s.num}
                </span>
                <h3 className="text-sm font-semibold text-[#1A120B] mb-2">{s.title}</h3>
                <p className="text-[#1A120B]/60 text-xs leading-relaxed mb-4 flex-1">{s.short}</p>
                <div
                  className="flex items-center justify-between pt-3 mt-auto"
                  style={{ borderTop: '1px solid rgba(139,223,221,0.25)' }}
                >
                  <span className="font-bold text-sm" style={{ color: '#F48F68' }}>{s.price}</span>
                  <span className="text-[#1A120B]/40 text-xs hover:text-[#8BDFDD] transition-colors cursor-pointer">
                    Подробнее →
                  </span>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>

        {/* CTA-блок */}
        <FadeInView delay={0.2}>
          <div
            className="rounded-3xl p-8 md:p-12 max-w-2xl mx-auto text-center"
            style={{ background: '#FFFFFF', border: '2px solid rgba(139,223,221,0.3)' }}
          >
            <h3 className="text-xl font-bold text-[#1A120B] mb-2">Не знаете, что выбрать?</h3>
            <p className="text-[#1A120B]/60 text-sm mb-6">
              Оставьте номер — дизайнер позвонит и поможет разобраться
            </p>
            <form onSubmit={submitLead} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="form-input-light" type="text" placeholder="Ваше имя"
                  value={name} onChange={(e) => setName(e.target.value)} required />
                <input className="form-input-light" type="tel" placeholder="Телефон"
                  value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <label className="flex items-center gap-2 text-[#1A120B]/50 text-xs cursor-pointer text-left">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
                  className="accent-[#8BDFDD]" required />
                Соглашаюсь на обработку{' '}
                <a href="#" className="underline" style={{ color: '#8BDFDD' }}>персональных данных</a>
                {' '}согласно ФЗ-152
              </label>
              <button type="submit" className="btn-coral justify-center" disabled={status === 'loading'}>
                {status === 'loading' ? 'Отправляем...' : 'Получить консультацию бесплатно'}
              </button>
              {status === 'success' && <p className="text-green-600 text-sm">Отлично! Позвоним в ближайшее время.</p>}
              {status === 'error' && <p className="text-red-500 text-sm">Ошибка. Напишите: dizain.seichas@yandex.ru</p>}
            </form>
          </div>
        </FadeInView>
      </div>

      {activeModal && <ServiceModal service={activeService} onClose={() => setActiveModal(null)} />}
    </section>
  )
}
