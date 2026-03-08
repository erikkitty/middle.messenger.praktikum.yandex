import { mockUser } from '../mock-user';
import { updateView } from '../__user-info/settings-page__user-info';

const FIELDS = ['email', 'login', 'first_name', 'second_name', 'display_name', 'phone'] as const;

export function backToProfile(): void {
  const content = document.getElementById('settings-content');
  const slot = document.getElementById('settings-change-data-slot');
  content?.classList.remove('settings-content--data-view');
  if (slot) slot.textContent = '';
}

function fillForm(): void {
  FIELDS.forEach((key) => {
    const input = document.querySelector(
      `.settings-change-data__input[data-field="${key}"]`
    ) as HTMLInputElement | null;
    if (input) input.value = mockUser[key];
  });
}

function saveEdit(): void {
  const form = document.getElementById('settings-change-data-form') as HTMLFormElement | null;
  if (!form) return;
  const formData = new FormData(form);
  FIELDS.forEach((key) => {
    const val = formData.get(key);
    if (val !== null && typeof val === 'string') {
      (mockUser as unknown as Record<string, string>)[key] = val.trim();
    }
  });
  updateView();
  backToProfile();
}

export function initChangeData(): void {
  document.querySelector('[data-action="back-to-profile"]')?.addEventListener('click', backToProfile);
  document.querySelector('[data-action="cancel-edit-data"]')?.addEventListener('click', backToProfile);

  fillForm();

  const form = document.getElementById('settings-change-data-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveEdit();
  });
}
