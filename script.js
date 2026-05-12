// Бургер
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('nav--open');
  burger.classList.toggle('burger--open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('nav--open');
  burger.classList.remove('burger--open');
}));

// Мобильное меню
const s = document.createElement('style');
s.textContent = `@media(max-width:900px){.nav{display:flex!important;flex-direction:column;position:fixed;top:72px;left:0;right:0;background:rgba(26,26,46,0.97);backdrop-filter:blur(16px);padding:16px 24px;gap:0;height:auto;transform:translateY(-110%);transition:transform .35s ease;z-index:999;border-bottom:1px solid rgba(201,160,80,0.2)}.nav--open{transform:translateY(0)}.nav-link{flex:none;justify-content:flex-start;padding:14px 0;border-bottom:1px solid rgba(201,160,80,0.1);color:rgba(232,228,220,0.8);display:block;font-size:15px}.burger--open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}.burger--open span:nth-child(2){opacity:0}.burger--open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}}`;
document.head.appendChild(s);

// Табы портфолио
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('tab-btn--active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('tab-content--active'));
    btn.classList.add('tab-btn--active');
    const id = 'tab-' + btn.dataset.tab;
    const el = document.getElementById(id);
    if (el) el.classList.add('tab-content--active');
  });
});

// Калькулятор — мультивыбор услуг
function calcPrice() {
  var area = parseFloat(document.getElementById('area').value) || 0;
  var checks = document.querySelectorAll('#serviceChecks input[type=checkbox]:checked');
  var resultEl = document.getElementById('priceResult');
  var hintEl = document.getElementById('priceHint');
  if (!resultEl) return;

  if (checks.length === 0) {
    resultEl.textContent = 'Выберите услуги';
    resultEl.style.fontSize = '16px';
    if (hintEl) hintEl.textContent = '';
    return;
  }

  var totalArea = 0;
  var totalFixed = 0;
  var hasRequest = false;
  var hints = [];

  checks.forEach(function(cb) {
    var type = cb.dataset.type;
    var val  = parseFloat(cb.value) || 0;
    var name = cb.dataset.label;
    if (type === 'area') {
      totalArea += val;
      if (area > 0) hints.push(name + ': от ' + (val * area).toLocaleString('ru-RU') + ' ₽');
      else          hints.push(name + ': от ' + val.toLocaleString('ru-RU') + ' ₽/м²');
    } else if (type === 'fixed') {
      totalFixed += val;
      hints.push(name + ': ' + val.toLocaleString('ru-RU') + ' ₽');
    } else {
      hasRequest = true;
      hints.push(name + ': по запросу');
    }
  });

  var numericTotal = (area > 0 ? totalArea * area : 0) + totalFixed;

  if (hasRequest && numericTotal === 0) {
    resultEl.textContent = 'по запросу';
    resultEl.style.fontSize = '22px';
  } else if (hasRequest) {
    resultEl.textContent = 'от ' + numericTotal.toLocaleString('ru-RU') + ' ₽ + по запросу';
    resultEl.style.fontSize = '16px';
  } else if (numericTotal > 0) {
    resultEl.textContent = 'от ' + numericTotal.toLocaleString('ru-RU') + ' ₽';
    resultEl.style.fontSize = '26px';
  } else {
    resultEl.textContent = 'Укажите площадь';
    resultEl.style.fontSize = '16px';
  }
  if (hintEl) hintEl.innerHTML = hints.join('<br>');
}
calcPrice();

// Форма калькулятора - отправка через Web3Forms
async function submitCalcForm(e) {
  e.preventDefault();
  var btn     = document.getElementById('calcBtn');
  var success = document.getElementById('calcSuccess');
  var error   = document.getElementById('calcError');
  var area    = document.getElementById('area').value;
  var checks  = document.querySelectorAll('#serviceChecks input[type=checkbox]:checked');
  var package_name = Array.from(checks).map(cb => cb.dataset.label).join(', ') || 'не выбрано';
  var price   = document.getElementById('priceResult').textContent;

  btn.textContent = 'Отправляем...';
  btn.disabled = true;
  success.style.display = 'none';
  error.style.display   = 'none';

  var payload = {
    access_key: WEB3FORMS_KEY,
    subject:    'Запрос стоимости с сайта Дизайн Сейчас',
    from_name:  'Калькулятор Дизайн Сейчас',
    'Имя':      document.getElementById('calcName').value,
    'Телефон':  document.getElementById('calcPhone').value,
    'Пакет':    package_name,
    'Стоимость': price,
    'Площадь':  area ? area + ' м²' : 'не указана',
    'Комментарий': document.getElementById('calcComment').value || '-'
  };

  try {
    var res  = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(payload)
    });
    var json = await res.json();
    if(json.success) {
      success.style.display = 'block';
      document.getElementById('calcForm').reset();
      calcPrice();
    } else { throw new Error(json.message); }
  } catch(err) {
    error.style.display = 'block';
    console.error('CalcForm error:', err);
  } finally {
    btn.textContent = 'Узнать точную стоимость';
    btn.disabled = false;
  }
}

// Скролл шапки — прозрачная → тёмная
window.addEventListener('scroll', () => {
  const hdr = document.getElementById('header');
  if (window.scrollY > 60) {
    hdr.classList.add('scrolled');
  } else {
    hdr.classList.remove('scrolled');
  }
});

// Анимация при скролле
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; } });
}, { threshold: 0.1 });
document.querySelectorAll('.service-card,.project-card,.blog-card,.about__num-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  obs.observe(el);
});

// Модальные окна
function openModal(id){
  var m = document.getElementById(id);
  if(m){m.classList.add('open'); document.body.style.overflow='hidden';}
}
function closeModal(id){
  var m = document.getElementById(id);
  if(m){m.classList.remove('open'); document.body.style.overflow='';}
}
document.addEventListener('click', function(e){
  if(e.target.classList.contains('modal')) closeModal(e.target.id);
});
document.addEventListener('keydown', function(e){
  if(e.key==='Escape') document.querySelectorAll('.modal.open').forEach(function(m){closeModal(m.id);});
});


// Web3Forms - тихая отправка без открытия почты
var WEB3FORMS_KEY = '571ed5f8-bdbc-459e-a3e1-aec1c09223b4';

async function submitForm(e) {
  e.preventDefault();
  var btn     = document.getElementById('submitBtn');
  var success = document.getElementById('formSuccess');
  var error   = document.getElementById('formError');
  var form    = document.getElementById('contactForm');

  btn.textContent = 'Отправляем...';
  btn.disabled    = true;
  success.style.display = 'none';
  error.style.display   = 'none';

  var data = new FormData(form);
  data.append('access_key', WEB3FORMS_KEY);
  data.append('subject',    'Новая заявка с сайта Дизайн Сейчас');
  data.append('from_name',  'Сайт Дизайн Сейчас');

  // Подменяем названия полей для читаемого письма
  var payload = {
    access_key:   WEB3FORMS_KEY,
    subject:      'Новая заявка с сайта Дизайн Сейчас',
    from_name:    'Сайт Дизайн Сейчас',
    'Имя':        data.get('name')      || '',
    'Телефон':    data.get('phone')     || '',
    'Метраж':     (data.get('area') || 'не указан') + ' м²',
    'Тип':        data.get('room_type') || 'не указан',
    'Пакет':      data.get('package')   || 'не выбран'
  };

  try {
    var res = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(payload)
    });
    var json = await res.json();
    if(json.success) {
      success.style.display = 'block';
      success.textContent   = 'С вами скоро свяжутся! Обычно мы отвечаем в течение 15 минут.';
      form.reset();
    } else {
      throw new Error(json.message || 'error');
    }
  } catch(err) {
    error.style.display = 'block';
    error.textContent   = 'Не удалось отправить. Напишите нам напрямую: dizain.seichas@yandex.ru';
    console.error('Web3Forms error:', err);
  } finally {
    btn.textContent = 'Отправить заявку';
    btn.disabled    = false;
  }
}

// Форма "Получить консультацию"
async function submitLeadForm(e) {
  e.preventDefault();
  var btn     = document.getElementById('leadBtn');
  var success = document.getElementById('leadSuccess');
  var error   = document.getElementById('leadError');
  var agree   = document.getElementById('leadAgree');

  // Проверяем галочку
  if(!agree || !agree.checked) {
    agree.style.outline = '2px solid #c0392b';
    agree.style.borderRadius = '3px';
    setTimeout(function(){ agree.style.outline = ''; }, 2000);
    return;
  }

  btn.textContent = 'Отправляем...';
  btn.disabled    = true;
  success.style.display = 'none';
  error.style.display   = 'none';

  var payload = {
    access_key: WEB3FORMS_KEY,
    subject:    'Запрос консультации с сайта Дизайн Сейчас',
    from_name:  'Сайт Дизайн Сейчас',
    'Имя':     document.getElementById('leadName').value,
    'Телефон': document.getElementById('leadPhone').value,
    'Источник': 'Форма «Не знаете что выбрать»'
  };

  try {
    var res  = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(payload)
    });
    var json = await res.json();
    if(json.success) {
      success.style.display = 'block';
      document.getElementById('leadForm').reset();
    } else { throw new Error(json.message); }
  } catch(err) {
    error.style.display = 'block';
    console.error('LeadForm error:', err);
  } finally {
    btn.textContent = 'Получить консультацию';
    btn.disabled    = false;
  }
}

// Скролл грамот - кнопками и перетаскиванием мышью
function scrollAwards(dir) {
  var track = document.getElementById('awardsTrack');
  track.scrollBy({ left: dir * 380, behavior: 'smooth' });
}

(function awardsScroll(){
  var track = document.getElementById('awardsTrack');
  if(!track) return;
  var isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', function(e){
    isDown = true; track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', function(){ isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mouseup',   function(){ isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', function(e){
    if(!isDown) return; e.preventDefault();
    var x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
})();

// ===== СЛАЙДЕР ОТЗЫВОВ =====
(function(){
  const track = document.getElementById('reviewsTrack');
  const slider = document.getElementById('reviewsSlider');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  const dotsWrap = document.getElementById('reviewsDots');
  if(!track) return;

  const slides = track.querySelectorAll('.reviews__slide');
  let current = 0;
  let perView = window.innerWidth < 500 ? 1 : window.innerWidth < 768 ? 2 : 3;
  const total = slides.length;

  // Создаём точки
  slides.forEach((_,i) => {
    const d = document.createElement('button');
    d.className = 'reviews__dot' + (i===0?' reviews__dot--active':'');
    d.setAttribute('aria-label','Отзыв '+(i+1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function goTo(idx){
    const max = Math.max(0, total - perView);
    current = Math.max(0, Math.min(idx, max));
    const slideW = slides[0].offsetWidth + 18;
    track.style.transform = `translateX(-${current * slideW}px)`;
    dotsWrap.querySelectorAll('.reviews__dot').forEach((d,i) => {
      d.classList.toggle('reviews__dot--active', i === current);
    });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= max;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  window.addEventListener('resize', () => {
    perView = window.innerWidth < 500 ? 1 : window.innerWidth < 768 ? 2 : 3;
    goTo(current);
  });

  // Автопрокрутка каждые 4 сек
  let autoPlay = setInterval(() => {
    const max = Math.max(0, total - perView);
    goTo(current < max ? current + 1 : 0);
  }, 4000);

  // Пауза при наведении
  slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
  slider.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      const max = Math.max(0, total - perView);
      goTo(current < max ? current + 1 : 0);
    }, 4000);
  });

  goTo(0);
})();

// ===== ЛАЙТБОКС =====
document.addEventListener('DOMContentLoaded', function(){
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  const lbOverlay = document.getElementById('lightboxOverlay');
  const lbCounter = document.getElementById('lightboxCounter');
  if(!lb) return;

  const slides = Array.from(document.querySelectorAll('.reviews__slide img'));
  const srcs = slides.map(i => i.getAttribute('src'));
  let current = 0;

  // Курсор-лупа
  slides.forEach(img => { img.parentElement.style.cursor = 'zoom-in'; });

  function openLb(idx){
    current = idx;
    lbImg.src = srcs[current];
    lbCounter.textContent = (current+1) + ' / ' + srcs.length;
    lb.style.display = 'flex';
    requestAnimationFrame(() => lb.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    lbPrev.style.display = current === 0 ? 'none' : 'flex';
    lbNext.style.display = current === srcs.length-1 ? 'none' : 'flex';
  }

  function closeLb(){
    lb.classList.remove('is-open');
    setTimeout(() => { lb.style.display='none'; lbImg.src=''; }, 300);
    document.body.style.overflow = '';
  }

  function prevLb(){ if(current > 0) openLb(current-1); }
  function nextLb(){ if(current < srcs.length-1) openLb(current+1); }

  // Клик по слайду
  slides.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => openLb(i));
  });

  lbClose.addEventListener('click', closeLb);
  lbOverlay.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', prevLb);
  lbNext.addEventListener('click', nextLb);

  // Клавиатура
  document.addEventListener('keydown', e => {
    if(!lb.classList.contains('is-open')) return;
    if(e.key === 'Escape') closeLb();
    if(e.key === 'ArrowLeft') prevLb();
    if(e.key === 'ArrowRight') nextLb();
  });
});
