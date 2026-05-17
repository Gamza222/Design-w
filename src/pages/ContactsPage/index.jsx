import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa'
import FadeInView from '../../shared/ui/FadeInView'

const WEB3FORMS_KEY = '571ed5f8-bdbc-459e-a3e1-aec1c09223b4'
const init = { name: '', phone: '', area: '', room_type: '', package: 'Не выбран', agree: false }

const socials = [
  { href: 'https://t.me/yourusername', label: 'Telegram', Icon: FaTelegramPlane, bg: '#2AABEE' },
  { href: 'https://vk.me/yourusername', label: 'VKontakte', Icon: FaVk, bg: '#4C75A3' },
  { href: 'https://wa.me/78007077483', label: 'WhatsApp', Icon: FaWhatsapp, bg: '#25D366' },
]

const info = [
  { icon: '🕐', label: 'Часы работы', value: 'Пн–Пт 10:00–19:00' },
  { icon: '⚡', label: 'Ответ на заявку', value: 'В течение 30 минут' },
  { icon: '🌍', label: 'Формат работы', value: 'Онлайн, по всей России' },
  { icon: '📞', label: 'Звонок', value: 'Бесплатно по России' },
]

export default function ContactsPage() {
  const [form, setForm] = useState(init)
  const [status, setStatus] = useState('idle')
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Новая заявка с сайта Дизайн Сейчас',
          from_name: 'Сайт Дизайн Сейчас',
          Имя: form.name, Телефон: form.phone,
          Метраж: (form.area || 'не указан') + ' м²',
          Тип: form.room_type || 'не указан',
          Пакет: form.package,
        }),
      })
      const json = await res.json()
      if (json.success) { setStatus('success'); setForm(init) }
      else throw new Error()
    } catch { setStatus('error') }
  }

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: '#243050' }}>
      <div className="container">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: 'rgba(232,228,220,0.4)' }}>
          <Link to="/" className="hover:text-[#C9A050] transition-colors">Главная</Link>
          <span>/</span>
          <span style={{ color: '#C9A050' }}>Контакты</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Левая колонка */}
          <FadeInView>
            <p className="section-tag">Контакты</p>
            <h1 className="section-title mb-6">Просто напишите нам</h1>

            <a href="tel:+78007077483" className="block text-3xl font-bold mb-1 transition-colors hover:opacity-80"
              style={{ color: '#C9A050' }}>8 (800) 707-74-83</a>
            <p className="text-sm mb-8" style={{ color: 'rgba(232,228,220,0.5)' }}>Бесплатно по России</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {socials.map(({ href, label, Icon, bg }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: bg }}>
                  <Icon size={16} />{label}
                </a>
              ))}
            </div>

            <a href="mailto:dizain.seichas@yandex.ru" className="text-sm transition-colors hover:text-[#C9A050]"
              style={{ color: 'rgba(232,228,220,0.5)' }}>
              dizain.seichas@yandex.ru
            </a>

            <div className="mt-10 space-y-4">
              {info.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(232,228,220,0.4)' }}>{item.label}</p>
                    <p className="text-sm font-medium" style={{ color: 'rgba(232,228,220,0.8)' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInView>

          {/* Форма */}
          <FadeInView delay={0.1}>
            <div className="rounded-3xl p-7 md:p-9" style={{ background: '#1E2240', border: '1px solid rgba(201,160,80,0.15)' }}>
              <h2 className="font-bold text-xl mb-6" style={{ color: '#E8E4DC' }}>Оставьте заявку</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Имя <span style={{ color: '#C9A050' }}>*</span></label>
                    <input className="form-input" type="text" placeholder="Как вас зовут?" value={form.name} onChange={set('name')} required />
                  </div>
                  <div>
                    <label className="form-label">Телефон <span style={{ color: '#C9A050' }}>*</span></label>
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
                      <option value="Квартира">Квартира</option>
                      <option value="Дом">Частный дом</option>
                      <option value="Офис">Офис</option>
                      <option value="Коммерческое">Коммерческое</option>
                      <option value="Другое">Другое</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Желаемый пакет услуг</label>
                  <select className="form-input" value={form.package} onChange={set('package')}>
                    <option value="Не выбран">Ещё не выбрал пакет</option>
                    <option value="01 - Планировка">01 — Планировка (от 2 500 ₽/м²)</option>
                    <option value="02 - Планировка + коллажи">02 — Планировка + коллажи (от 3 000 ₽/м²)</option>
                    <option value="03 - Планировка + электрика">03 — Планировка + электрика (от 3 500 ₽/м²)</option>
                    <option value="04 - Планировка + визуализации">04 — Планировка + визуализации (от 3 500 ₽/м²)</option>
                    <option value="05 - Полный эскизный дизайн-проект">05 — Полный эскизный проект (от 5 000 ₽/м²)</option>
                    <option value="Авторский надзор">Авторский надзор</option>
                    <option value="Комплектация">Комплектация</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'rgba(232,228,220,0.5)' }}>
                  <input type="checkbox" required checked={form.agree}
                    onChange={(e) => setForm({ ...form, agree: e.target.checked })} className="accent-[#C9A050]" />
                  Я даю согласие на обработку{' '}
                  <a href="#" className="underline" style={{ color: '#C9A050' }}>персональных данных</a>{' '}согласно ФЗ-152
                </label>
                <button type="submit" className="btn-gold justify-center" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
                </button>
                {status === 'success' && <p className="text-green-400 text-sm">Заявка отправлена! Свяжемся с вами в ближайшее время.</p>}
                {status === 'error' && <p className="text-red-400 text-sm">Ошибка отправки. Позвоните или напишите нам напрямую.</p>}
              </form>
            </div>
          </FadeInView>
        </div>
      </div>
    </div>
  )
}
