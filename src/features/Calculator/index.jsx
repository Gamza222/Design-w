import { useState } from 'react'
import { tariffs, extras } from '../../shared/data/services'
import FadeInView from '../../shared/ui/FadeInView'

const WEB3FORMS_KEY = '571ed5f8-bdbc-459e-a3e1-aec1c09223b4'

export default function Calculator() {
  const [selectedTariff, setSelectedTariff] = useState(null) // id тарифа
  const [selectedExtras, setSelectedExtras] = useState({})   // { extraId: bool }
  const [area, setArea] = useState(50)
  const [form, setForm] = useState({ name: '', phone: '', comment: '', agree: false })
  const [status, setStatus] = useState('idle')

  const activeTariff = tariffs.find((t) => t.id === selectedTariff)

  const toggleExtra = (extra) => {
    if (activeTariff?.includes3D && extra.id === 'extra3d') return
    setSelectedExtras((prev) => ({ ...prev, [extra.id]: !prev[extra.id] }))
  }

  const calcResult = () => {
    if (!activeTariff) return { text: 'Выберите тариф', hint: '' }
    const hints = []
    let total = 0
    let hasRequest = false

    // Тариф
    const tariffCost = activeTariff.value * (area || 0)
    total += tariffCost
    hints.push(`${activeTariff.title}: от ${tariffCost.toLocaleString('ru-RU')} ₽`)

    // Доп. услуги
    extras.forEach((ex) => {
      const isBlocked = activeTariff.includes3D && ex.id === 'extra3d'
      if (isBlocked) {
        hints.push(`3D-визуализация: включена в тариф`)
        return
      }
      if (!selectedExtras[ex.id]) return
      if (ex.type === 'area') {
        const cost = ex.value * (area || 0)
        total += cost
        hints.push(`${ex.title}: от ${cost.toLocaleString('ru-RU')} ₽`)
      } else if (ex.type === 'fixed') {
        total += ex.value
        hints.push(`${ex.title}: ${ex.value.toLocaleString('ru-RU')} ₽`)
      } else {
        hasRequest = true
        hints.push(`${ex.title}: по запросу`)
      }
    })

    const text = hasRequest
      ? `от ${total.toLocaleString('ru-RU')} ₽ + по запросу`
      : total > 0
      ? `от ${total.toLocaleString('ru-RU')} ₽`
      : 'Укажите площадь'

    return { text, hint: hints.join('\n') }
  }

  const { text: priceText, hint: priceHint } = calcResult()

  const selectedExtrasLabels = extras
    .filter((ex) => selectedExtras[ex.id])
    .map((ex) => ex.title)
    .join(', ')

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
          Тариф: activeTariff?.title || 'не выбран',
          'Доп. услуги': selectedExtrasLabels || 'нет',
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
    <section className="py-24 bg-[#1C2340]" id="price">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-10">
            <p className="section-tag">Стоимость</p>
            <h2 className="section-title">Сколько стоит дизайн-проект?</h2>
            <p className="section-sub">
              Выберите тариф, укажите площадь — увидите примерную сумму. Точные цифры назовём после короткого разговора.
            </p>
          </div>
        </FadeInView>

        <div className="bg-[#1E2240] border border-[rgba(254,193,4,0.15)] rounded-3xl p-6 md:p-10">
          
          {/* ТАРИФЫ */}
          <div className="mb-8">
            <label className="form-label mb-4 block">
              Выберите тариф{' '}
              <span className="text-[rgba(232,228,220,0.4)] font-normal normal-case">(один вариант)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {tariffs.map((t) => {
                const isActive = selectedTariff === t.id
                return (
                  <label
                    key={t.id}
                    className={`relative flex flex-col p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'border-[#FEC104] bg-[rgba(254,193,4,0.1)] shadow-[0_0_0_1px_rgba(254,193,4,0.4)]'
                        : 'border-[rgba(254,193,4,0.12)] hover:border-[rgba(254,193,4,0.35)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tariff"
                      value={t.id}
                      checked={isActive}
                      onChange={() => setSelectedTariff(t.id)}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[rgba(254,193,4,0.4)] text-xl font-bold leading-none">{t.num}</span>
                      {isActive && (
                        <span className="w-5 h-5 rounded-full bg-[#FEC104] flex items-center justify-center shrink-0">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l2.5 2.5L9 1" stroke="#1C2340" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="text-[#E8E4DC] text-sm font-semibold mb-1">{t.title}</span>
                    <span className="text-[#FEC104] text-xs">{t.priceLabel}</span>
                    {t.includes3D && (
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#FEC104] bg-[rgba(254,193,4,0.1)] px-2 py-0.5 rounded-full w-fit">
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
            <label className="form-label mb-4 block">
              Дополнительные услуги{' '}
              <span className="text-[rgba(232,228,220,0.4)] font-normal normal-case">(можно несколько)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {extras.map((ex) => {
                const isBlocked = activeTariff?.includes3D && ex.id === 'extra3d'
                const isChecked = !!selectedExtras[ex.id]
                return (
                  <label
                    key={ex.id}
                    className={`relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                      isBlocked
                        ? 'border-[rgba(254,193,4,0.08)] opacity-60 cursor-not-allowed'
                        : isChecked
                        ? 'border-[#FEC104] bg-[rgba(254,193,4,0.08)] cursor-pointer'
                        : 'border-[rgba(254,193,4,0.12)] hover:border-[rgba(254,193,4,0.3)] cursor-pointer'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked && !isBlocked}
                      disabled={isBlocked}
                      onChange={() => toggleExtra(ex)}
                      className="accent-[#FEC104] shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[#E8E4DC] text-xs font-medium">{ex.title}</span>
                        {isBlocked && (
                          <span className="text-[10px] font-semibold text-[#FEC104] bg-[rgba(254,193,4,0.15)] px-2 py-0.5 rounded-full">
                            ✦ Уже включено
                          </span>
                        )}
                      </div>
                      <span className="text-[#FEC104] text-xs">{ex.priceLabel}</span>
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
            <div className="bg-[rgba(254,193,4,0.05)] border border-[rgba(254,193,4,0.2)] rounded-2xl p-5">
              <label className="form-label">Итоговая стоимость</label>
              <div className="text-2xl font-bold text-[#FEC104] mt-2 mb-3">{priceText}</div>
              {priceHint && (
                <pre className="text-[rgba(232,228,220,0.5)] text-xs whitespace-pre-wrap font-sans leading-relaxed">
                  {priceHint}
                </pre>
              )}
            </div>
          </div>

          {/* ФОРМА */}
          <form onSubmit={handleSubmit} className="border-t border-[rgba(254,193,4,0.1)] pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="form-label">Ваше имя</label>
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
                <input className="form-input" type="text" placeholder="Любые пожелания" value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-[rgba(232,228,220,0.5)] text-xs cursor-pointer">
                <input type="checkbox" required checked={form.agree}
                  onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                  className="accent-[#FEC104]" />
                Я соглашаюсь с{' '}
                <a href="#" className="text-[#FEC104] underline">политикой конфиденциальности</a>
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
