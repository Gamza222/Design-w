import { useState } from 'react'
import FadeInView from './FadeInView'
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa'

const WEB3FORMS_KEY = '571ed5f8-bdbc-459e-a3e1-aec1c09223b4'

const initialForm = {
  name: '', phone: '', area: '', room_type: '', package: 'Не выбран', agree: false,
}

export default function Contacts() {
  const [form, setForm] = useState(initialForm)
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
          subject: 'Новая заявка с сайта Дизайн Сейчас',
          from_name: 'Сайт Дизайн Сейчас',
          Имя: form.name,
          Телефон: form.phone,
          Метраж: (form.area || 'не указан') + ' м²',
          Тип: form.room_type || 'не указан',
          Пакет: form.package || 'не выбран',
        }),
      })
      const json = await res.json()
      if (json.success) {
        setStatus('success')
        setForm(initialForm)
      } else throw new Error()
    } catch {
      setStatus('error')
    }
  }

  const inputCls = 'form-input'
  const labelCls = 'form-label'

  return (
    <section className="py-24 bg-[#16213E]" id="contacts">
      <div className="container">
        <FadeInView>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Левая колонка */}
          <div>
            <p className="section-tag">Контакты</p>
            <h2 className="section-title mb-6">Просто напишите нам. Мы рады помочь.</h2>

            <a href="tel:+78007077483" className="block text-3xl font-bold text-[#C9A97A] hover:text-[#F5B800] transition-colors mb-1">
              8 (800) 707-74-83
            </a>
            <p className="text-[rgba(232,228,220,0.5)] text-sm mb-8">Бесплатно по России</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { href: 'https://t.me/yourusername', label: 'Telegram', icon: FaTelegramPlane, color: 'bg-[#2AABEE]' },
                { href: 'https://vk.me/yourusername', label: 'VK', icon: FaVk, color: 'bg-[#4C75A3]' },
                { href: 'https://wa.me/78007077483', label: 'WhatsApp', icon: FaWhatsapp, color: 'bg-[#25D366]' },
              ].map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${m.color} text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2`}
                >
                  <m.icon size={16} />
                  {m.label}
                </a>
              ))}
            </div>

            <a href="mailto:dizain.seichas@yandex.ru" className="text-[rgba(232,228,220,0.6)] hover:text-[#C9A97A] transition-colors text-sm">
              dizain.seichas@yandex.ru
            </a>
          </div>

          {/* Форма */}
          <div className="bg-[#1E2240] border border-[rgba(201,169,122,0.15)] rounded-3xl p-7 md:p-9">
            <h3 className="text-[#E8E4DC] font-bold text-xl mb-6">Оставьте заявку</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Имя <span className="text-[#C9A97A]">*</span></label>
                  <input className={inputCls} type="text" placeholder="Как вас зовут?" value={form.name} onChange={set('name')} required />
                </div>
                <div>
                  <label className={labelCls}>Телефон <span className="text-[#C9A97A]">*</span></label>
                  <input className={inputCls} type="tel" placeholder="+7 (___) ___-__-__" value={form.phone} onChange={set('phone')} required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Метраж (м²)</label>
                  <input className={inputCls} type="number" placeholder="Например: 65" value={form.area} onChange={set('area')} min={5} max={2000} />
                </div>
                <div>
                  <label className={labelCls}>Тип помещения</label>
                  <select className={inputCls} value={form.room_type} onChange={set('room_type')}>
                    <option value="">Выберите тип</option>
                    <option value="Квартира">Квартира</option>
                    <option value="Дом">Частный дом</option>
                    <option value="Офис">Офис</option>
                    <option value="Коммерческое">Коммерческое помещение</option>
                    <option value="Другое">Другое</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Желаемый пакет услуг</label>
                <select className={inputCls} value={form.package} onChange={set('package')}>
                  <option value="Не выбран">Ещё не выбрал пакет</option>
                  <option value="01 - Планировка">01 - Планировка (от 2 500 ₽)</option>
                  <option value="02 - Планировка + коллажи">02 - Планировка + коллажи (от 3 000 ₽)</option>
                  <option value="03 - Планировка + электрика">03 - Планировка + электрика (от 3 500 ₽)</option>
                  <option value="04 - Планировка + визуализации">04 - Планировка + визуализации (от 3 500 ₽)</option>
                  <option value="05 - 3D-визуализация">05 - 3D-визуализация (от 1 000 ₽)</option>
                  <option value="06 - Полный эскизный дизайн-проект">06 - Полный эскизный дизайн-проект (от 5 000 ₽)</option>
                  <option value="07 - Авторский надзор">07 - Авторский надзор</option>
                  <option value="08 - Комплектация">08 - Комплектация</option>
                  <option value="09 - Консультация по эргономике">09 - Консультация по эргономике (20 000 ₽)</option>
                  <option value="10 - Консультация перед реализацией">10 - Консультация перед реализацией (10 000 ₽)</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-[rgba(232,228,220,0.5)] text-xs cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.agree}
                  onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                  className="accent-[#C9A97A]"
                />
                Я даю согласие на обработку{' '}
                <a href="#" className="text-[#C9A97A] underline">персональных данных</a>
                {' '}согласно ФЗ-152
              </label>
              <button type="submit" className="btn-gold justify-center" disabled={status === 'loading'}>
                {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
              </button>
              {status === 'success' && (
                <p className="text-green-400 text-sm">Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm">Ошибка отправки. Позвоните нам или напишите на почту.</p>
              )}
            </form>
          </div>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
