import { mockUser } from "../mock-user";

function initSettingsAvatar() {
  const avatarWrapper = document.querySelector(".settings-avatar__wrapper");
  const avatarImage = document.querySelector(
    ".settings-avatar__image",
  ) as HTMLImageElement | null;
  const nameEl = document.querySelector(
    ".settings-avatar__name",
  ) as HTMLElement | null;

  if (avatarImage) avatarImage.src = mockUser.avatar || "";
  if (nameEl) nameEl.textContent = mockUser.display_name;

  avatarWrapper?.addEventListener("click", () => {
    document
      .querySelector(".settings-modal")
      ?.classList.add("settings-modal--visible");
  });
}

initSettingsAvatar();

export {};
