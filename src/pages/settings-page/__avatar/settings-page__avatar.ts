import { mockUser } from "../mock-user";

const LS_USER_KEY = "app.user";

function getUserFromLS(): Partial<typeof mockUser> | null {
  const raw = localStorage.getItem(LS_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Partial<typeof mockUser>;
  } catch {
    return null;
  }
}

export function initSettingsAvatar(root: HTMLElement): void {
  const avatarWrapper = root.querySelector(".settings-avatar__wrapper");
  const avatarImage = root.querySelector(
    ".settings-avatar__image",
  ) as HTMLImageElement | null;
  const nameEl = root.querySelector(
    ".settings-avatar__name",
  ) as HTMLElement | null;
  const modal = document.querySelector(".settings-modal");

  const userFromLS = getUserFromLS();
  const avatar = userFromLS?.avatar || mockUser.avatar;
  const displayName = userFromLS?.display_name || mockUser.display_name;

  if (avatarImage) avatarImage.src = avatar || "";
  if (nameEl) nameEl.textContent = displayName;

  avatarWrapper?.addEventListener("click", () => {
    modal?.classList.add("settings-modal--visible");
  });
}
