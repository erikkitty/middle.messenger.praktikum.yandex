import './__avatar/settings-page__avatar.ts';
import './__user-info/settings-page__user-info.ts';
import './__links/settings-page__links.ts';
import './__modal/settings-page__modal.ts';
import './__change-password/settings-page__change-password.ts';

const win = window as Window & { renderChatPage?: () => void; renderAuthForm?: () => void };

function initSettingsPage() {
  const backBtn = document.querySelector('[data-action="back"]');
  backBtn?.addEventListener('click', () => {
    win.renderChatPage?.();
  });
}

initSettingsPage();

export {};
