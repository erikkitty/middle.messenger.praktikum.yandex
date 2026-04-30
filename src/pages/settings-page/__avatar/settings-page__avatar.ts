import { settingsController } from "../../../controllers/settings.controller";

export function initSettingsAvatar(root: HTMLElement): void {
  const avatarWrapper = root.querySelector(".settings-avatar__wrapper");
  const avatarImage = root.querySelector(
    ".settings-avatar__image",
  ) as HTMLImageElement | null;
  const nameEl = root.querySelector(
    ".settings-avatar__name",
  ) as HTMLElement | null;
  const modal = document.querySelector(".settings-modal");
  const fileInput = modal?.querySelector<HTMLInputElement>("#avatar-upload");
  const fileLink = root.querySelector(".settings-modal__file-link");
  const submitBtn = modal?.querySelector<HTMLButtonElement>(".settings-modal__submit");
  const fileNameEl = modal?.querySelector<HTMLElement>("#settings-modal-file-name");

  const user = JSON.parse(localStorage.getItem("app.user") || "{}");
  const avatar = user.avatar || "";
  const displayName = user.display_name || `${user.first_name || ""} ${user.second_name || ""}`;

  if (avatarImage) avatarImage.src = avatar || "";
  if (nameEl) nameEl.textContent = displayName;

  avatarWrapper?.addEventListener("click", () => {
    modal?.classList.add("settings-modal--visible");
  });

  modal?.querySelector(".settings-modal__close")?.addEventListener("click", () => {
    modal.classList.remove("settings-modal--visible");
  });

  fileLink?.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput?.click();
  });

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (fileNameEl) fileNameEl.textContent = file ? file.name : "";
  });

  submitBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const file = fileInput?.files?.[0];
    if (!file) {
      alert("Выберите файл");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите изображение");
      return;
    }

    try {
      await settingsController.uploadAvatar(file);
      const url = URL.createObjectURL(file);
      if (avatarImage) avatarImage.src = url;
      modal?.classList.remove("settings-modal--visible");
      if (fileInput) fileInput.value = "";
      if (fileNameEl) fileNameEl.textContent = "";
    } catch (error) {
      console.error("Avatar upload error:", error);
      alert("Не удалось загрузить аватар");
    }
  });
}
