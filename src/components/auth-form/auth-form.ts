function initAuthForm() {
  const form = document.querySelector('.auth-form__form') as HTMLFormElement | null;
  if (!form) return;

  const loginInput = form.querySelector('input[name="login"]') as HTMLInputElement | null;
  const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement | null;

  if (!loginInput || !passwordInput) return;

  const validate = (mode: 'input' | 'submit' = 'input') => {
    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    let loginError = '';
    let passwordError = '';

    if (mode === 'submit') {
      if (!login) {
        loginError = 'Введите логин';
      }
      if (!password) {
        passwordError = 'Введите пароль';
      }

      if (!loginError && !passwordError) {
        const isValid = login === 'ivanivanov' && password === '123';

        if (!isValid) {
          loginError = 'Неверный логин или пароль';
          passwordError = 'Неверный логин или пароль';
        }
      }
    }

    const loginWrapper = loginInput.closest('.auth-form__input-wrapper');
    const passwordWrapper = passwordInput.closest('.auth-form__input-wrapper');

    if (loginWrapper) {
      loginWrapper.classList.toggle('has-error', !!loginError);
      const errEl = loginWrapper.querySelector('.auth-form__input-error');
      if (errEl) errEl.textContent = loginError;
    }

    if (passwordWrapper) {
      passwordWrapper.classList.toggle('has-error', !!passwordError);
      const errEl = passwordWrapper.querySelector('.auth-form__input-error');
      if (errEl) errEl.textContent = passwordError;
    }

    return { loginError, passwordError };
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const { loginError, passwordError } = validate('submit');

    if (!loginError && !passwordError) {
      (window as Window & { renderChatPage?: () => void }).renderChatPage?.();
    }
  });

  loginInput.addEventListener('input', () => validate('input'));
  passwordInput.addEventListener('input', () => validate('input'));
}

initAuthForm();

export {};