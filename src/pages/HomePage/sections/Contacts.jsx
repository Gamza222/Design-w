import { useState } from 'react'
import FadeInView from '../../../shared/ui/FadeInView'

const WEB3FORMS_KEY = '571ed5f8-bdbc-459e-a3e1-aec1c09223b4'

const INITIAL = { name: '', phone: '', area: '', room_type: '', package: 'Не выбран', agree: false }

export default function Contacts() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle')

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Новая заявка — Дизайн Сейчас',
          from_name: 'Сайт Дизайн Сейчас',
          Имя: form.name, Телефон: form.phone,
          Метраж: (form.area || 'не указан') + ' м²',
          Тип: form.room_type || 'не указан',
          Пакет: form.package,
        }),
      })
      const json = await res.json()
      if (json.success) { setStatus('success'); setForm(INITIAL) }
      else throw new Error()
    } catch { setStatus('error') }
  }

  return (
    <section className="py-24" style={{ background: '#1C2340' }} id="contacts">
      <div className="container">
        <FadeInView>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Левая часть */}
            <div>
              <p className="section-tag">Контакты</p>
              <h2 className="section-title mb-6">Просто напишите нам. Мы рады помочь.</h2>

              <a
                href="tel:+78007077483"
                className="block text-3xl font-bold mb-1 transition-colors"
                style={{ color: '#F48F68' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FFE394' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#F48F68' }}
              >
                8 (800) 707-74-83
              </a>
              <p className="text-white/45 text-sm mb-8">Бесплатно по России</p>

              {/* Мессенджеры */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { href: 'https://t.me/yourusername',  label: 'Telegram', color: '#2AABEE' },
                  { href: 'https://vk.me/yourusername', label: 'ВКонтакте', color: '#4C75A3' },
                  { href: 'https://wa.me/78007077483',  label: 'WhatsApp', color: '#25D366' },
                ].map((m) => (
                  <a
                    key={m.label}
                    href={m.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-85"
                    style={{ background: m.color }}
                  >
                    {m.label}
                  </a>
                ))}
              </div>

              <a
                href="mailto:dizain.seichas@yandex.ru"
                className="text-sm transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#8BDFDD' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
              >
                dizain.seichas@yandex.ru
              </a>

              <div className="mt-10 space-y-4">
                {[
                  { icon: '🕐', label: 'Часы работы',      value: 'Пн–Пт 10:00–19:00' },
                  { icon: '⚡', label: 'Ответ на заявку',  value: 'В течение 30 минут' },
                  { icon: '🌍', label: 'Формат работы',     value: 'Онлайн по всей России' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-white/35 text-xs">{item.label}</p>
                      <p className="text-white/80 text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Форма */}
            <div
              className="rounded-3xl p-7 md:p-9"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,223,221,0.2)' }}
            >
              <h3 className="text-white font-bold text-xl mb-6">Оставьте заявку</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Имя *</label>
                    <input className="form-input" type="text" placeholder="Как вас зовут?" value={form.name} onChange={set('name')} required />
                  </div>
                  <div>
                    <label className="form-label">Телефон *</label>
                    <input className="form-input" type="tel" placeholder="+7 (___) ___-__-__" value={form.phone} onChange={set('phone')} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Метраж (м²)</label>
                    <input className="form-input" type="number" placeholder="Например: 65" value={form.area} onChange={set('area')} min={5} max={2000} />
                  </div>
                  <div>
                    <label className="form-label">Тип помещения</label>
                    <select className="form-input" value={form.room_type} onChange={set('room_type')}>
                      <option value="">Выберите тип</option>
                      <option>Квартира</option>
                      <option>Частный дом</option>
                      <option>Офис</option>
                      <option>Коммерческое</option>
                      <option>Другое</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Желаемый пакет</label>
                  <select className="form-input" value={form.package} onChange={set('package')}>
                    <option value="Не выбран">Ещё не выбрал</option>
                    <option value="01 — Планировка">01 — Планировка (от 2 500 ₽/м²)</option>
                    <option value="02 — Планировка + коллажи">02 — Планировка + коллажи (от 3 000 ₽/м²)</option>
                    <option value="03 — Планировка + электрика">03 — Планировка + электрика (от 3 500 ₽/м²)</option>
                    <option value="04 — Планировка + визуализации">04 — Планировка + визуализации (от 3 500 ₽/м²)</option>
                    <option value="05 — Полный эскизный проект">05 — Полный эскизный проект (от 5 000 ₽/м²)</option>
                    <option value="Авторский надзор">Авторский надзор</option>
                    <option value="Комплектация">Комплектация</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-white/45 text-xs cursor-pointer">
                  <input type="checkbox" required checked={form.agree}
                    onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                    className="accent-[#8BDFDD]" />
                  Даю согласие на обработку{' '}
                  <a href="#" style={{ color: '#8BDFDD' }} className="underline">персональных данных</a>
                  {' '}(ФЗ-152)
                </label>
                <button type="submit" className="btn-coral justify-center" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
                </button>
                {status === 'success' && <p className="text-green-400 text-sm">Заявка отправлена! Свяжемся в ближайшее время.</p>}
                {status === 'error' && <p className="text-red-400 text-sm">Ошибка. Напишите: dizain.seichas@yandex.ru</p>}
              </form>
            </div>

          </div>
        </FadeInView>
      </div>
    </section>
  )
}
