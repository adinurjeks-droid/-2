/* ===== 1. Мобильное меню ===== */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));


/* меняется тема черная и белая */
const themeBtn = document.getElementById('themeBtn');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '🌞' : '🌑';
  try { localStorage.setItem('theme', theme); } catch (e) {}
}

let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(saved || (systemDark ? 'dark' : 'light'));

themeBtn.addEventListener('click', () => {
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});


/* ===== 3. Проверка формы ===== */
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

// Правила: у каждого поля своя проверка, возвращает текст ошибки или ''
const rules = {
  name: v => v.trim().length < 2 ? 'Введите имя (минимум 2 символа).' : '',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Введите корректный email, например name@mail.com.',
  message: v => v.trim().length < 10 ? 'Сообщение должно содержать минимум 10 символов.' : ''
};

function validateField(id) {
  const input = document.getElementById(id);
  const error = rules[id](input.value);
  document.getElementById(id + 'Error').textContent = error;
  input.closest('.field').classList.toggle('invalid', error !== '');
  input.setAttribute('aria-invalid', error !== '');
  return error === '';
}

// Ошибка исчезает, как только пользователь начинает исправлять поле
Object.keys(rules).forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    success.textContent = '';
    if (document.getElementById(id).closest('.field').classList.contains('invalid')) validateField(id);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const results = Object.keys(rules).map(validateField); // проверяем все поля
  if (results.every(Boolean)) {
    const name = document.getElementById('name').value.trim();
    success.textContent = `Спасибо, ${name}! Ваше сообщение отправлено.`;
    form.reset();
  } else {
    success.textContent = '';
    form.querySelector('.invalid input, .invalid textarea').focus(); // фокус на первое неверное поле
  }
});


/* ===== 4. Модальное окно кейса */
const modal = document.getElementById('modal');

document.querySelectorAll('.case').forEach(card => {
  card.querySelector('.case__img').addEventListener('click', () => {
    const img = card.querySelector('img');
    document.getElementById('modalImg').src = img.src;
    document.getElementById('modalImg').alt = img.alt;
    document.getElementById('modalDate').textContent = card.dataset.date;
    document.getElementById('modalTitle').textContent = card.dataset.title;
    document.getElementById('modalText').textContent = card.dataset.text;
    modal.showModal(); // Escape закрывает окно автоматически
  });
});

document.getElementById('modalClose').addEventListener('click', () => modal.close());

// Клик по тёмному фону (вне окна) тоже закрывает
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
