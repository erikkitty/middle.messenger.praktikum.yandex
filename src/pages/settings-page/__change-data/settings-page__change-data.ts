import { mockUser } from "../mock-user";
import { updateView } from "../__user-info/settings-page__user-info";
import { validateField, collectStringValues } from "../../../utils/validation";

const FIELDS = [
  "email",
  "login",
  "first_name",
  "second_name",
  "display_name",
  "phone",
] as const;

export function backToProfile(): void {
  const content = document.getElementById("settings-content");
  const slot = document.getElementById("settings-change-data-slot");
  content?.classList.remove("settings-content--data-view");
  if (slot) slot.textContent = "";
}

function fillForm(): void {
  FIELDS.forEach((key) => {
    const input = document.querySelector(
      `.settings-change-data__input[data-field="${key}"]`,
    ) as HTMLInputElement | null;
    if (input) input.value = mockUser[key];
  });
}

function saveEdit(): void {
  const form = document.getElementById(
    "settings-change-data-form",
  ) as HTMLFormElement | null;
  if (!form) return;

  const allValues = collectStringValues(form);
  let isValid = true;

  FIELDS.forEach((key) => {
    const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement | null;
    if (input) {
      const result = validateField(key, input.value, allValues);
      if (!result.ok) {
        isValid = false;
        const field = input.closest(".settings-change-data__field");
        if (field) {
          field.classList.add("has-error");
          const errorEl = field.querySelector(".settings-change-data__error");
          if (errorEl) errorEl.textContent = result.message;
        }
      }
    }
  });

  if (!isValid) return;

  const formData = new FormData(form);
  FIELDS.forEach((key) => {
    const val = formData.get(key);
    if (val !== null && typeof val === "string") {
      mockUser[key] = val.trim();
    }
  });
  updateView();
  backToProfile();
}

export function initChangeData(): void {
  document
    .querySelector('[data-action="back-to-profile"]')
    ?.addEventListener("click", backToProfile);
  document
    .querySelector('[data-action="cancel-edit-data"]')
    ?.addEventListener("click", backToProfile);

  fillForm();

  const form = document.getElementById("settings-change-data-form");
  form?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    saveEdit();
  });

  FIELDS.forEach((key) => {
    const input = form?.querySelector(`[name="${key}"]`) as HTMLInputElement | null;
    input?.addEventListener("blur", () => {
      const allValues = collectStringValues(form as HTMLFormElement);
      const result = validateField(key, input.value, allValues);
      const field = input.closest(".settings-change-data__field");
      if (field) {
        field.classList.toggle("has-error", !result.ok);
        const errorEl = field.querySelector(".settings-change-data__error");
        if (errorEl) errorEl.textContent = result.ok ? "" : result.message;
      }
    });

    input?.addEventListener("input", () => {
      const field = input.closest(".settings-change-data__field");
      if (field) {
        field.classList.remove("has-error");
        const errorEl = field.querySelector(".settings-change-data__error");
        if (errorEl) errorEl.textContent = "";
      }
    });
  });
}
