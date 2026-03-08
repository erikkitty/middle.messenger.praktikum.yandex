function showMessage(el: HTMLElement | null, text: string, kind: 'error' | 'hint') {
  if (!el) return;
  el.textContent = text;
  el.className = 'settings-modal__message' + (kind === 'error' ? ' settings-modal__message--error' : ' settings-modal__message--hint');
}

function clearMessage(el: HTMLElement | null) {
  if (!el) return;
  el.textContent = '';
  el.className = 'settings-modal__message';
}

function initSettingsModal() {
  const modal = document.querySelector('.settings-modal');
  const fileLink = document.querySelector('.settings-modal__file-link');
  const fileInput = document.getElementById('avatar-upload') as HTMLInputElement | null;
  const fileNameEl = document.getElementById('settings-modal-file-name');
  const messageEl = document.getElementById('settings-modal-message');
  const form = document.getElementById('settings-modal-avatar-form') as HTMLFormElement | null;
  const closeBtn = document.querySelector('[data-action="close-modal"]');

  fileLink?.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput?.click();
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (fileNameEl) fileNameEl.textContent = file ? file.name : '';
    clearMessage(messageEl);
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('settings-modal--visible');
    if (fileInput) fileInput.value = '';
    if (fileNameEl) fileNameEl.textContent = '';
    clearMessage(messageEl);
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('settings-modal--visible');
      if (fileInput) fileInput.value = '';
      if (fileNameEl) fileNameEl.textContent = '';
      clearMessage(messageEl);
    }
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = fileInput?.files?.[0];
    clearMessage(messageEl);

    if (!file) {
      showMessage(messageEl, 'Выберите файл', 'hint');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const result = ev.target?.result;
        if (typeof result !== 'string' || !result.startsWith('data:')) {
          showMessage(messageEl, 'Ошибка, попробуйте ещё раз', 'error');
          return;
        }
        const img = document.querySelector('.settings-avatar__image') as HTMLImageElement | null;
        if (img) img.src = result;
        if (fileInput) fileInput.value = '';
        if (fileNameEl) fileNameEl.textContent = '';
        clearMessage(messageEl);
        modal?.classList.remove('settings-modal--visible');
      } catch {
        showMessage(messageEl, 'Ошибка, попробуйте ещё раз', 'error');
      }
    };
    reader.onerror = () => {
      showMessage(messageEl, 'Ошибка, попробуйте ещё раз', 'error');
    };
    reader.readAsDataURL(file);
  });
}

initSettingsModal();

export {};
