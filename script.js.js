// ===== Бургер-меню =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.nav a').forEach(a =>
    a.addEventListener('click', () => nav.classList.remove('open'))
  );
}

// ===== Плавный скролл =====
document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(el.getAttribute('data-scroll'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Кнопка «Наверх» =====
const toTop = document.getElementById('toTop');
if (toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('visible', window.scrollY > 500);
  });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

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

// ===== ОТПРАВКА ФОРМЫ ЧЕРЕЗ FORMTOMAIL.RU =====
const form = document.getElementById('leadForm');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Останавливаем стандартную перезагрузку страницы
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    
    // Валидация
    const data = new FormData(form);
    const name = data.get('name')?.trim();
    const phone = data.get('phone')?.trim();
    const service = data.get('service');
    const comment = data.get('comment')?.trim();

    if (!name || phone.replace(/\D/g, '').length < 11) {
      alert('Пожалуйста, заполните имя и телефон корректно.');
      return;
    }

    // Блокируем кнопку на время отправки
    submitBtn.innerText = 'Отправка...';
    submitBtn.disabled = true;

    // ⚠️ ВСТАВЬТЕ СЮДА ВАШ API-КЛЮЧ ИЗ ЛИЧНОГО КАБИНЕТА
    const API_KEY = 'ВАШ_API_КЛЮЧ_ИЗ_FORMTOMAIL'; 

    try {
      const response = await fetch('https://api.formtomail.ru/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Новая заявка с сайта ОкнаБел (Белорецк)',
          body: {
            'Имя': name,
            'Телефон': phone,
            'Услуга': service,
            'Комментарий': comment || 'Не указан'
          }
        })
      });

      if (response.ok) {
        alert('Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 15 минут.');
        form.reset(); // Очищаем форму
      } else {
        throw new Error('Ошибка сервера');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка при отправке. Пожалуйста, позвоните нам напрямую по телефону.');
    } finally {
      // Возвращаем кнопку в исходное состояние
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}