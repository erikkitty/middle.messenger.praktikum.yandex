function initChatHeader() {
  const btn = document.querySelector(
    ".chat-header__profile-btn",
  ) as HTMLButtonElement | null;
  if (!btn) return;

  btn.addEventListener("click", () => {
    (
      window as Window & { renderSettingsPage?: () => void }
    ).renderSettingsPage?.();
  });
}

initChatHeader();

export {};
