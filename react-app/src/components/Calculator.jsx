import { useState } from 'react'
import { services } from '../data/services'
import FadeInView from './FadeInView'

const WEB3FORMS_KEY = '571ed5f8-bdbc-459e-a3e1-aec1c09223b4'

export default function Calculator() {
  const [selected, setSelected] = useState({})
  const [area, setArea] = useState(50)
  const [form, setForm] = useState({ name: '', phone: '', comment: '', agree: false })
  const [status, setStatus] = useState('idle')

  const toggleService = (s) => {
    setSelected((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
  }

  const calcResult = () => {
    const activeServices = services.filter((s) => selected[s.id])
    if (activeServices.length === 0) return { text: 'Выберите услуги', hint: '' }

    let totalArea = 0
    let totalFixed = 0
    let hasRequest = false
    const hints = []

    activeServices.forEach((s) => {
      if (s.type === 'area') {
        totalArea += s.value
        if (area > 0) hints.push(`${s.title}: от ${(s.value * area).toLocaleString('ru-RU')} ₽`)
        else hints.push(`${s.title}: от ${s.value.toLocaleString('ru-RU')} ₽/м²`)
      } else if (s.type === 'fixed') {
        totalFixed += s.value
        hints.push(`${s.title}: ${s.value.toLocaleString('ru-RU')} ₽`)
      } else {
        hasRequest = true
        hints.push(`${s.title}: по запросу`)
      }
    })

    const numeric = (area > 0 ? totalArea * area : 0) + totalFixed

    let text
    if (hasRequest && numeric === 0) text = 'по запросу'
    else if (hasRequest) text = `от ${numeric.toLocaleString('ru-RU')} ₽ + по запросу`
    else if (numeric > 0) text = `от ${numeric.toLocaleString('ru-RU')} ₽`
    else text = 'Укажите площадь'

    return { text, hint: hints.join('\n') }
  }

  const { text: priceText, hint: priceHint } = calcResult()
  const selectedLabels = services.filter((s) => selected[s.id]).map((s) => s.title).join(', ')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Запрос стоимости с сайта Дизайн Сейчас',
          from_name: 'Калькулятор Дизайн Сейчас',
          Имя: form.name,
          Телефон: form.phone,
          Пакет: selectedLabels || 'не выбрано',
          Стоимость: priceText,
          Площадь: area ? `${area} м²` : 'не указана',
          Комментарий: form.comment || '-',
        }),
      })
      const json = await res.json()
      setStatus(json.success ? 'success' : 'error')
      if (json.success) setForm({ name: '', phone: '', comment: '', agree: false })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-24 bg-[#1A1A2E]" id="price">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-10">
            <p className="section-tag">Стоимость</p>
            <h2 className="section-title">Сколько стоит дизайн-проект?</h2>
            <p className="section-sub">
              Выберите нужные услуги, укажите площадь — увидите примерную сумму. Точные цифры назовём после короткого разговора.
            </p>
          </div>
        </FadeInView>

        <div className="bg-[#1E2240] border border-[rgba(201,169,122,0.15)] rounded-3xl p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Список услуг */}
            <div className="lg:col-span-2">
              <label className="form-label">
                Выберите услуги{' '}
                <span className="text-[rgba(232,228,220,0.4)] font-normal normal-case">(можно несколько)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {services.map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selected[s.id]
                        ? 'border-[#C9A97A] bg-[rgba(201,169,122,0.08)]'
                        : 'border-[rgba(201,169,122,0.12)] hover:border-[rgba(201,169,122,0.3)]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!selected[s.id]}
                      onChange={() => toggleService(s)}
                      className="accent-[#C9A97A] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[#E8E4DC] text-xs font-medium block truncate">{s.num} — {s.title}</span>
                      <span className="text-[#C9A97A] text-xs">{s.priceLabel}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Площадь + результат */}
            <div className="flex flex-col gap-5">
              <div>
                <label className="form-label">Площадь (м²)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Например: 65"
                  value={area}
                  min={5}
                  max={2000}
                  onChange={(e) => setArea(Number(e.target.value))}
                />
              </div>
              <div className="bg-[rgba(201,169,122,0.05)] border border-[rgba(201,169,122,0.2)] rounded-2xl p-5 flex-1">
                <label className="form-label">Итоговая стоимость</label>
                <div className="text-2xl font-bold text-[#C9A97A] mt-2 mb-3">{priceText}</div>
                {priceHint && (
                  <pre className="text-[rgba(232,228,220,0.5)] text-xs whitespace-pre-wrap font-sans leading-relaxed">
                    {priceHint}
                  </pre>
                )}
              </div>
            </div>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="border-t border-[rgba(201,169,122,0.1)] pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="form-label">Ваше имя</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Имя"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Телефон</label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Комментарий</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Любые пожелания"
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-[rgba(232,228,220,0.5)] text-xs cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.agree}
                  onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                  className="accent-[#C9A97A]"
                />
                Я соглашаюсь с{' '}
                <a href="#" className="text-[#C9A97A] underline">политикой конфиденциальности</a>
              </label>
              <button type="submit" className="btn-gold whitespace-nowrap" disabled={status === 'loading'}>
                {status === 'loading' ? 'Отправляем...' : 'Узнать точную стоимость'}
              </button>
            </div>
            {status === 'success' && (
              <p className="text-green-400 text-sm mt-4">С вами скоро свяжутся и назовут точную цифру!</p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-sm mt-4">Не удалось отправить. Напишите нам: dizain.seichas@yandex.ru</p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
