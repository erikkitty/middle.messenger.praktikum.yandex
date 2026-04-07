import { collectStringValues, validateField } from "../../../utils/validation";

export function backToProfile() {
  const content = document.getElementById("settings-content");
  const slot = document.getElementById("settings-change-password-slot");
  content?.classList.remove("settings-content--password-view");
  if (slot) slot.textContent = "";
}

export function initChangePassword() {
  const backBtn = document.querySelector('[data-action="back-to-profile"]');
  if (backBtn) {
    backBtn.addEventListener("click", backToProfile);
  }

  const form = document.querySelector(".settings-change-password__form") as HTMLFormElement;
  if (!form) return;

  const oldPasswordInput = form.querySelector(
    "#old-password",
  ) as HTMLInputElement;
  const newPasswordInput = form.querySelector(
    "#new-password",
  ) as HTMLInputElement;
  const confirmPasswordInput = form.querySelector(
    "#confirm-password",
  ) as HTMLInputElement;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  
  [oldPasswordInput, newPasswordInput, confirmPasswordInput].forEach(
    (input) => {
      input?.addEventListener("blur", () => {
        const field = input.closest(".settings-change-password__field");
        if (field) {
          const allValues = collectStringValues(form);
          const result = validateField(input.name, input.value, allValues);
          field.classList.toggle("has-error", !result.ok);
          const errorEl = field.querySelector(".settings-change-password__error");
          if (errorEl) errorEl.textContent = result.ok ? "" : result.message;
        }
      });

      input?.addEventListener("input", () => {
        const field = input.closest(".settings-change-password__field");
        if (field) {
          field.classList.remove("has-error");
          const errorEl = field.querySelector(
            ".settings-change-password__error",
          );
          if (errorEl) errorEl.textContent = "";
        }
      });
    },
  );
}
