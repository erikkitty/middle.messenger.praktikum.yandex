const win = window as Window & {
  renderAuthForm?: () => void;
  showChangeDataView?: () => void;
  showChangePasswordView?: () => void;
};

function initSettingsLinks() {
  const editDataBtn = document.querySelector('[data-action="edit-data"]');
  const passwordBtn = document.querySelector('[data-action="edit-password"]');
  const logoutBtn = document.querySelector('[data-action="logout"]');

  editDataBtn?.addEventListener("click", () => {
    win.showChangeDataView?.();
  });

  passwordBtn?.addEventListener("click", () => {
    win.showChangePasswordView?.();
  });

  logoutBtn?.addEventListener("click", () => {
    if (confirm("Вы уверены, что хотите выйти?")) {
      win.renderAuthForm?.();
    }
  });
}

initSettingsLinks();

export {};
