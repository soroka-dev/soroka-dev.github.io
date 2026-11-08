const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  mobileMenu.hidden = isOpen;
});

mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const leadForm = document.getElementById('lead-form');
const leadState = leadForm.querySelector('.form-state');
const leadButton = leadForm.querySelector('.submit-button');
const leadEndpoint = 'https://sorokadev-leads-bot.soroka-development.workers.dev/lead';

leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!leadForm.reportValidity()) return;

  const fields = Object.fromEntries(new FormData(leadForm));
  leadButton.disabled = true;
  leadButton.textContent = 'Отправляем…';
  leadState.textContent = 'Отправляем заявку…';
  leadState.dataset.state = 'sending';

  try {
    const result = await fetch(leadEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const data = await result.json();
    if (!result.ok) throw new Error(data.message || 'Не удалось отправить заявку. Попробуйте ещё раз.');

    leadForm.reset();
    leadState.textContent = data.message;
    leadState.dataset.state = 'success';
  } catch (error) {
    leadState.textContent = error instanceof Error
      ? error.message
      : 'Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.';
    leadState.dataset.state = 'error';
  } finally {
    leadButton.disabled = false;
    leadButton.textContent = 'Отправить заявку';
  }
});
