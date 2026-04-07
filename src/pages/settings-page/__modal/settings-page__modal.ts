import { mockUser } from "../mock-user";

export function initSettingsModal(root: HTMLElement): void {
  const modal = document.querySelector(".settings-modal");
  const fileLink = root.querySelector(".settings-modal__file-link");
  const fileInput = root.querySelector(
    "#avatar-upload",
  ) as HTMLInputElement | null;
  const fileNameEl = root.querySelector(
    "#settings-modal-file-name",
  ) as HTMLElement | null;
  const messageEl = root.querySelector(
    "#settings-modal-message",
  ) as HTMLElement | null;
  const modalForm = root.querySelector(
    "#settings-modal-avatar-form",
  ) as HTMLFormElement | null;
  const closeBtn = root.querySelector('[data-action="close-modal"]');
  const avatarImage = document.querySelector(
    ".settings-avatar__image",
  ) as HTMLImageElement | null;

  function showMessage(text: string, kind: "error" | "hint"): void {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className =
      "settings-modal__message" +
      (kind === "error"
        ? " settings-modal__message--error"
        : " settings-modal__message--hint");
  }

  function clearMessage(): void {
    if (!messageEl) return;
    messageEl.textContent = "";
    messageEl.className = "settings-modal__message";
  }

  function closeModal(): void {
    modal?.classList.remove("settings-modal--visible");
    if (fileInput) fileInput.value = "";
    if (fileNameEl) fileNameEl.textContent = "";
    clearMessage();
  }

  fileLink?.addEventListener("click", (e: Event) => {
    e.preventDefault();
    fileInput?.click();
  });

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (fileNameEl) fileNameEl.textContent = file ? file.name : "";
    clearMessage();
  });

  closeBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e: Event) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  modalForm?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    const file = fileInput?.files?.[0];
    clearMessage();

    if (!file) {
      showMessage("Выберите файл", "hint");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const result = ev.target?.result;
        if (typeof result !== "string" || !result.startsWith("data:")) {
          showMessage("Ошибка, попробуйте ещё раз", "error");
          return;
        }
        if (avatarImage) avatarImage.src = result;
        if (fileInput) fileInput.value = "";
        if (fileNameEl) fileNameEl.textContent = "";
        mockUser.avatar = result;
        closeModal();
      } catch {
        showMessage("Ошибка, попробуйте ещё раз", "error");
      }
    };
    reader.onerror = () => {
      showMessage("Ошибка, попробуйте ещё раз", "error");
    };
    reader.readAsDataURL(file);
  });
}
