// ===== Бургер-меню =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// ===== Плавный скролл по data-scroll =====
document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(el.getAttribute('data-scroll'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Кнопка «Наверх» =====
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('visible', window.scrollY > 500);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Маска телефона =====
const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
  phoneInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (!v.startsWith('7')) v = '7' + v;
    v = v.slice(0, 11);
    let formatted = '+7';
    if (v.length > 1) formatted += ' (' + v.slice(1, 4);
    if (v.length >= 5) formatted += ') ' + v.slice(4, 7);
    if (v.length >= 8) formatted += '-' + v.slice(7, 9);
    if (v.length >= 10) formatted += '-' + v.slice(9, 11);
    e.target.value = formatted;
  });
}

// ===== Отправка формы (на email / WhatsApp) =====
const form = document.getElementById('leadForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.trim();
    const phone = data.get('phone')?.trim();
    const service = data.get('service');
    const comment = data.get('comment')?.trim();

    if (!name || phone.replace(/\D/g, '').length < 11) {
      alert('Пожалуйста, заполните имя и телефон корректно.');
      return;
    }

    // Вариант 1: открыть WhatsApp с готовым сообщением
    const msg = `Заявка с сайта ОкнаБел\nИмя: ${name}\nТелефон: ${phone}\nУслуга: ${service}\nКомментарий: ${comment || '—'}`;
    const waUrl = `https://wa.me/79876543210?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    // Вариант 2: mailto
    // window.location.href = `mailto:info@oknabel.ru?subject=Заявка с сайта&body=${encodeURIComponent(msg)}`;

    form.reset();
    alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
  });
}