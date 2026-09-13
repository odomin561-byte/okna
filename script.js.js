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
    e.preventDefault(); // Останавливаем стандартную перезагрузку страницы

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    // Собираем данные из полей формы
    const formData = new FormData(form);
    const name = formData.get('name')?.trim();
    const phone = formData.get('phone')?.trim();
    const service = formData.get('service');
    const comment = formData.get('comment')?.trim();

    // Простая проверка, что имя и телефон заполнены
    if (!name || phone.replace(/\D/g, '').length < 11) {
      alert('Пожалуйста, заполните имя и телефон корректно.');
      return;
    }

    // Блокируем кнопку, чтобы пользователь не нажал её дважды
    submitBtn.innerText = 'Отправка...';
    submitBtn.disabled = true;

    try {
      // ВАШ КОД ОТ FORMTOMAIL (адаптированный под данные формы)
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
          }
        })
      });

      const result = await response.json();

      // Проверяем, успешно ли прошла отправка
      if (response.ok) {
        alert('Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 15 минут.');
        form.reset(); // Очищаем поля формы после успешной отправки
      } else {
        throw new Error(result.message || 'Ошибка сервера');
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      alert('Произошла ошибка при отправке. Пожалуйста, позвоните нам напрямую по телефону.');
    } finally {
      // В любом случае (успех или ошибка) возвращаем кнопку в исходное состояние
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}