// ===== 1. Бургер-меню =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.nav a').forEach(a =>
    a.addEventListener('click', () => nav.classList.remove('open'))
  );
}

// ===== 2. Плавный скролл =====
document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(el.getAttribute('data-scroll'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== 3. Кнопка «Наверх» =====
const toTop = document.getElementById('toTop');
if (toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('visible', window.scrollY > 500);
  });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== 4. Маска телефона =====
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

// ===== 5. ОТПРАВКА ФОРМЫ ЧЕРЕЗ FORMTOMAIL.RU =====
const form = document.getElementById('leadForm');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    const formData = new FormData(form);
    const name = formData.get('name')?.trim();
    const phone = formData.get('phone')?.trim();
    const service = formData.get('service');
    const comment = formData.get('comment')?.trim();
    
    // Считываем значение honeypot (оно будет пустым у человека, и заполненным у бота)
    const honeypotValue = formData.get('website')?.trim() || '';

    if (!name || phone.replace(/\D/g, '').length < 11) {
      alert('Пожалуйста, заполните имя и телефон корректно.');
      return;
    }

    submitBtn.innerText = 'Отправка...';
    submitBtn.disabled = true;

    try {
      const response = await fetch("https://api.formtomail.ru/send", {
        method: "POST",
        headers: {
          "Authorization": "Bearer r9hZPraD3cy1o3AX",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "Новая заявка с сайта ОкнаБел (Белорецк)",
          body: {
            "Имя": name,
            "Телефон": phone,
            "Услуга": service,
            "Комментарий": comment || "Не указан"
          },
          // Передаем honeypot на верхнем уровне, НЕ внутри body!
          honeypot: honeypotValue 
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 15 минут.');
        form.reset();
      } else if (response.status === 400) {
        // Показываем пользователю ошибку от сервера (согласно документации)
        alert(`Ошибка отправки: ${result.message}`);
      } else {
        // Другие ошибки (например, 403)
        console.error("FormToMail Error:", result);
        alert('Сервис отправки временно недоступен. Пожалуйста, позвоните нам напрямую.');
      }
    } catch (error) {
      console.error('Сетевая ошибка:', error);
      alert('Произошла сетевая ошибка. Пожалуйста, позвоните нам напрямую.');
    } finally {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}