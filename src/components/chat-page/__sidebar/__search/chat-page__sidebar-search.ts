function initChatSidebarSearch() {
  const input = document.querySelector(
    '.chat-sidebar__search-input'
  ) as HTMLInputElement | null;

  if (!input) return;

  input.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const items = document.querySelectorAll('.chat-sidebar__item');

    items.forEach((item) => {
      const name =
        item
          .querySelector('.chat-sidebar__item-name')
          ?.textContent?.toLowerCase() || '';

      item.classList.toggle('hidden', !name.includes(query));
    });
  });
}

initChatSidebarSearch();

export {};