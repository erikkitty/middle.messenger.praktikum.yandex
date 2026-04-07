import { mockUser } from "../mock-user";

const LS_USER_KEY = "app.user";

const FIELDS = [
  "email",
  "login",
  "first_name",
  "second_name",
  "display_name",
  "phone",
] as const;

function getUserFromLS(): Partial<typeof mockUser> | null {
  const raw = localStorage.getItem(LS_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Partial<typeof mockUser>;
  } catch {
    return null;
  }
}

function updateView(): void {
  const userFromLS = getUserFromLS();
  const user = userFromLS || mockUser;

  FIELDS.forEach((key) => {
    const el = document.querySelector(
      `.settings-user-info__value[data-field="${key}"]`,
    );
    if (el) (el as HTMLElement).textContent = user[key] || mockUser[key];
  });
  const nameEl = document.querySelector(".settings-avatar__name");
  if (nameEl) nameEl.textContent = user.display_name || mockUser.display_name;
  const avatarEl = document.querySelector(".settings-avatar__image") as HTMLImageElement | null;
  if (avatarEl && (user.avatar || mockUser.avatar)) avatarEl.src = user.avatar || mockUser.avatar || "";
}

function initSettingsUserInfo(): void {
  updateView();
}

initSettingsUserInfo();

export { updateView };
