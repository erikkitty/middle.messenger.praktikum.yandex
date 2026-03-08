import { mockUser } from '../mock-user';

const FIELDS = ['email', 'login', 'first_name', 'second_name', 'display_name', 'phone'] as const;

function updateView(): void {
  FIELDS.forEach((key) => {
    const el = document.querySelector(`.settings-user-info__value[data-field="${key}"]`);
    if (el) (el as HTMLElement).textContent = mockUser[key];
  });
  const nameEl = document.querySelector('.settings-avatar__name');
  if (nameEl) nameEl.textContent = mockUser.display_name;
}

function initSettingsUserInfo(): void {
  updateView();
}

initSettingsUserInfo();

export { updateView };
