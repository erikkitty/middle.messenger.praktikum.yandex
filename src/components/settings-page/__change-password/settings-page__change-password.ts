export function backToProfile() {
  const content = document.getElementById('settings-content');
  const slot = document.getElementById('settings-change-password-slot');
  content?.classList.remove('settings-content--password-view');
  if (slot) slot.textContent = '';
}

export function initChangePassword() {
  const backBtn = document.querySelector('[data-action="back-to-profile"]');
  if (backBtn) {
    backBtn.addEventListener('click', backToProfile);
  }

  const form = document.querySelector('.settings-change-password__form');
  if (!form) return;

  const oldPasswordInput = form.querySelector('#old-password') as HTMLInputElement;
  const newPasswordInput = form.querySelector('#new-password') as HTMLInputElement;
  const confirmPasswordInput = form.querySelector('#confirm-password') as HTMLInputElement;

  const validate = () => {
    const errors: Record<string, string> = {};
    const oldPassword = oldPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!oldPassword) {
      errors.oldPassword = 'Введите старый пароль';
    }

    if (!newPassword) {
      errors.newPassword = 'Введите новый пароль';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Пароль должен содержать минимум 8 символов';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Повторите новый пароль';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    const fields = [
      { input: oldPasswordInput, error: errors.oldPassword },
      { input: newPasswordInput, error: errors.newPassword },
      { input: confirmPasswordInput, error: errors.confirmPassword },
    ];

    fields.forEach(({ input, error }) => {
      const field = input.closest('.settings-change-password__field');
      if (field) {
        field.classList.toggle('has-error', !!error);
        const errorEl = field.querySelector('.settings-change-password__error');
        if (errorEl) errorEl.textContent = error;
      }
    });

    return errors;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0) {
      alert('Пароль успешно изменён!');
      backToProfile();
    }
  });

  [oldPasswordInput, newPasswordInput, confirmPasswordInput].forEach(input => {
    input?.addEventListener('input', () => {
      const field = input.closest('.settings-change-password__field');
      if (field) {
        field.classList.remove('has-error');
        const errorEl = field.querySelector('.settings-change-password__error');
        if (errorEl) errorEl.textContent = '';
      }
    });
  });
}