import { useState } from 'react'
import { tariffs, extras } from '../../shared/data/services'
import FadeInView from '../../shared/ui/FadeInView'

const WEB3FORMS_KEY = '571ed5f8-bdbc-459e-a3e1-aec1c09223b4'

export default function Calculator() {
  const [selectedTariff, setSelectedTariff] = useState(null)
  const [selectedExtras, setSelectedExtras] = useState({})
  const [area, setArea] = useState(50)
  const [form, setForm] = useState({ name: '', phone: '', comment: '', agree: false })
  const [status, setStatus] = useState('idle')

  const activeTariff = tariffs.find((t) => t.id === selectedTariff)

  const toggleExtra = (ex) => {
    if (activeTariff?.includes3D && ex.id === 'extra3d') return
    setSelectedExtras((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))
  }

  const calcResult = () => {
    if (!activeTariff) return { text: 'Выберите тариф', hint: '' }
    let total = 0
    const hints = []
    let hasRequest = false
    total += activeTariff.value * (area || 0)
    hints.push(`${activeTariff.title}: от ${(activeTariff.value * (area || 0)).toLocaleString('ru-RU')} ₽`)
    extras.forEach((ex) => {
      if (activeTariff.includes3D && ex.id === 'extra3d') {
        hints.push(`3D-визуализация: включена в тариф`)
        return
      }
      if (!selectedExtras[ex.id]) return
      if (ex.type === 'area') { total += ex.value * (area || 0); hints.push(`${ex.title}: от ${(ex.value * (area || 0)).toLocaleString('ru-RU')} ₽`) }
      else if (ex.type === 'fixed') { total += ex.value; hints.push(`${ex.title}: ${ex.value.toLocaleString('ru-RU')} ₽`) }
      else { hasRequest = true; hints.push(`${ex.title}: по запросу`) }
    })
    const text = hasRequest
      ? `от ${total.toLocaleString('ru-RU')} ₽ + по запросу`
      : `от ${total.toLocaleString('ru-RU')} ₽`
    return { text, hint: hints.join('\n') }
  }

  const { text: priceText, hint: priceHint } = calcResult()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Расчёт стоимости — Дизайн Сейчас',
          from_name: 'Калькулятор Дизайн Сейчас',
          Имя: form.name, Телефон: form.phone,
          Тариф: activeTariff?.title || 'не выбран',
          Стоимость: priceText,
          Площадь: area ? `${area} м²` : 'не указана',
          Комментарий: form.comment || '-',
        }),
      })
      const json = await res.json()
      setStatus(json.success ? 'success' : 'error')
      if (json.success) setForm({ name: '', phone: '', comment: '', agree: false })
    } catch { setStatus('error') }
  }

  return (
    <section className="py-24" style={{ background: '#243050' }} id="price">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-10">
            <p className="section-tag">Стоимость</p>
            <h2 className="section-title">Сколько стоит дизайн-проект?</h2>
            <p className="section-sub mx-auto">
              Выберите тариф, укажите площадь — увидите примерную сумму
            </p>
          </div>
        </FadeInView>

        <div className="rounded-3xl p-6 md:p-10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,223,221,0.15)' }}>

          {/* ТАРИФЫ */}
          <div className="mb-8">
            <p className="form-label mb-4">
              Тариф <span className="opacity-50 normal-case font-normal">(один вариант)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {tariffs.map((t) => {
                const isActive = selectedTariff === t.id
                return (
                  <label
                    key={t.id}
                    className="flex flex-col p-4 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      background: isActive ? 'rgba(244,143,104,0.1)' : 'rgba(255,255,255,0.04)',
                      border: isActive ? '2px solid #F48F68' : '2px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <input type="radio" name="tariff" value={t.id} checked={isActive}
                      onChange={() => setSelectedTariff(t.id)} className="sr-only" />
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xl font-bold" style={{ color: 'rgba(244,143,104,0.3)' }}>{t.num}</span>
                      {isActive && (
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#F48F68' }}>
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="text-white text-sm font-semibold mb-1">{t.title}</span>
                    <span className="text-xs" style={{ color: '#8BDFDD' }}>{t.priceLabel}</span>
                    {t.includes3D && (
                      <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit" style={{ background: 'rgba(139,223,221,0.15)', color: '#8BDFDD' }}>
                        ✦ 3D включено
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
          </div>

          {/* ДОП. УСЛУГИ */}
          <div className="mb-8">
            <p className="form-label mb-4">
              Доп. услуги <span className="opacity-50 normal-case font-normal">(можно несколько)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {extras.map((ex) => {
                const isBlocked = activeTariff?.includes3D && ex.id === 'extra3d'
                const isChecked = !!selectedExtras[ex.id]
                return (
                  <label key={ex.id}
                    className="flex items-start gap-3 p-4 rounded-xl transition-all duration-200"
                    style={{
                      opacity: isBlocked ? 0.5 : 1,
                      cursor: isBlocked ? 'not-allowed' : 'pointer',
                      background: isChecked && !isBlocked ? 'rgba(139,223,221,0.08)' : 'rgba(255,255,255,0.04)',
                      border: isChecked && !isBlocked ? '2px solid rgba(139,223,221,0.5)' : '2px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <input type="checkbox" checked={isChecked && !isBlocked} disabled={isBlocked}
                      onChange={() => toggleExtra(ex)} className="accent-[#8BDFDD] mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-xs font-medium">{ex.title}</span>
                        {isBlocked && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,223,221,0.15)', color: '#8BDFDD' }}>
                            ✦ Включено
                          </span>
                        )}
                      </div>
                      <span className="text-xs" style={{ color: '#8BDFDD' }}>{ex.priceLabel}</span>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* ПЛОЩАДЬ + ИТОГ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="form-label">Площадь (м²)</label>
              <input type="number" className="form-input" placeholder="Например: 65"
                value={area} min={5} max={2000} onChange={(e) => setArea(Number(e.target.value))} />
            </div>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(244,143,104,0.08)', border: '1px solid rgba(244,143,104,0.2)' }}>
              <label className="form-label">Итоговая стоимость</label>
              <div className="text-2xl font-bold mt-2 mb-2" style={{ color: '#F48F68' }}>{priceText}</div>
              {priceHint && (
                <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {priceHint}
                </pre>
              )}
            </div>
          </div>

          {/* ФОРМА */}
          <form onSubmit={handleSubmit} className="border-t border-white/8 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="form-label">Имя</label>
                <input className="form-input" type="text" placeholder="Имя" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Телефон</label>
                <input className="form-input" type="tel" placeholder="+7 (___) ___-__-__" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Комментарий</label>
                <input className="form-input" type="text" placeholder="Пожелания" value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-white/45 text-xs cursor-pointer">
                <input type="checkbox" required checked={form.agree}
                  onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                  className="accent-[#8BDFDD]" />
                Соглашаюсь с{' '}
                <a href="#" style={{ color: '#8BDFDD' }} className="underline">политикой конфиденциальности</a>
              </label>
              <button type="submit" className="btn-coral whitespace-nowrap" disabled={status === 'loading'}>
                {status === 'loading' ? 'Отправляем...' : 'Узнать точную стоимость'}
              </button>
            </div>
            {status === 'success' && <p className="text-green-400 text-sm mt-4">С вами свяжутся в ближайшее время!</p>}
            {status === 'error' && <p className="text-red-400 text-sm mt-4">Ошибка. Напишите: dizain.seichas@yandex.ru</p>}
          </form>
        </div>
      </div>
    </section>
  )
}
