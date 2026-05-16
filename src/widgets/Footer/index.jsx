import { Link } from 'react-router-dom'
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa'

const socials = [
  { href: 'https://t.me/yourusername', icon: FaTelegramPlane, label: 'Telegram' },
  { href: 'https://vk.me/yourusername', icon: FaVk, label: 'VK' },
  { href: 'https://wa.me/78007077483', icon: FaWhatsapp, label: 'WhatsApp' },
]

export default function Footer() {
  return (
    <footer className="bg-[#12122A] border-t border-[rgba(201,169,122,0.1)] py-14" id="footer">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Бренд */}
          <div>
            <img
              src="/logo.png"
              alt="Дизайн Сейчас"
              className="h-12 w-auto mb-4"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.insertAdjacentHTML(
                  'afterbegin',
                  '<span class="text-xl font-bold text-white">Дизайн <em class="text-[#C9A97A] not-italic">Сейчас</em></span>'
                )
              }}
            />
            <p className="text-[rgba(232,228,220,0.5)] text-sm leading-relaxed mb-4">
              Студия дизайна интерьера. Делаем пространства, в которых хочется проводить время.
            </p>
            <p className="text-[rgba(232,228,220,0.3)] text-xs">© 2025 Дизайн Сейчас. Все права защищены.</p>
          </div>

          {/* Услуги */}
          <div>
            <h4 className="text-[#E8E4DC] font-semibold text-sm mb-4">Услуги</h4>
            {[
              { href: '/#services', label: 'Дизайн-проект' },
              { to: '/portfolio', label: 'Портфолио' },
              { href: '/#about', label: 'О нас' },
              { to: '/blog', label: 'Блог и обзоры' },
              { href: '/#contacts', label: 'Контакты' },
            ].map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} className="block text-[rgba(232,228,220,0.5)] text-sm mb-2 hover:text-[#C9A97A] transition-colors">
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="block text-[rgba(232,228,220,0.5)] text-sm mb-2 hover:text-[#C9A97A] transition-colors">
                  {l.label}
                </a>
              )
            )}
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-[#E8E4DC] font-semibold text-sm mb-4">Контакты</h4>
            <a href="tel:+78007077483" className="block text-[rgba(232,228,220,0.5)] text-sm mb-2 hover:text-[#C9A97A] transition-colors">
              8 (800) 707-74-83
            </a>
            <a href="mailto:dizain.seichas@yandex.ru" className="block text-[rgba(232,228,220,0.5)] text-sm mb-4 hover:text-[#C9A97A] transition-colors">
              dizain.seichas@yandex.ru
            </a>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[rgba(201,169,122,0.2)] text-[#C9A97A] hover:bg-[rgba(201,169,122,0.15)] hover:border-[#C9A97A] transition-all"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Документы */}
          <div>
            <h4 className="text-[#E8E4DC] font-semibold text-sm mb-4">Документы</h4>
            {[
              'Политика конфиденциальности',
              'Реквизиты компании',
              'Договор оферты',
              'Лицензия на товарный знак',
            ].map((doc) => (
              <a key={doc} href="#" className="block text-[rgba(232,228,220,0.5)] text-sm mb-2 hover:text-[#C9A97A] transition-colors">
                {doc}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
