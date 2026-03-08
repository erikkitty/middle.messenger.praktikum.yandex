import {
  getChats,
  getChatById,
  createChat,
  deleteChat,
  updateChatAvatar,
  addUserToChat,
  removeUserFromChat,
  sendMessage,
} from '../../mock-chat';

const emptyStateHtml = `
  <div class="chat-content-empty">
    <p>Выберите чат, чтобы отправить сообщение</p>
  </div>
`;

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function renderChatList(container: HTMLElement, activeId: string | null): void {
  const chats = getChats();
  const listHtml = chats
    .map(
      (chat) => `
    <li class="chat-sidebar__item" data-chat-id="${escapeHtml(chat.id)}">
      <div class="chat-sidebar__item-avatar">
        <img src="${chat.avatar}" alt="${escapeHtml(chat.name)}">
      </div>
      <div class="chat-sidebar__item-info">
        <div class="chat-sidebar__item-name">${escapeHtml(chat.name)}</div>
        <div class="chat-sidebar__item-last-message">${escapeHtml(chat.lastMessage || 'Нет сообщений')}</div>
      </div>
      <div class="chat-sidebar__item-time">${escapeHtml(chat.time)}</div>
      ${chat.unread ? `<div class="chat-sidebar__item-unread">${chat.unread}</div>` : ''}
      <button class="chat-sidebar__item-menu" type="button" data-action="menu" aria-label="Меню">⋯</button>
    </li>
  `
    )
    .join('');

  container.innerHTML = listHtml;

  container.querySelectorAll('.chat-sidebar__item').forEach((el) => {
    const item = el as HTMLElement;
    const id = item.dataset.chatId ?? null;
    if (!id) return;

    item.classList.toggle('active', id === activeId);

    item.querySelector('[data-action="menu"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showChatMenu(id, item);
    });

    item.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('[data-action="menu"]')) return;
      onChatSelect(id);
    });
  });

}

function attachNewChatButton(): void {
  const btn = document.querySelector('[data-action="new-chat"]');
  btn?.addEventListener('click', () => {
    const name = prompt('Название чата');
    if (name == null) return;
    const chat = createChat(name);
    if (listEl) renderChatList(listEl, chat.id);
    onChatSelect(chat.id);
    if (contentEl) renderChatContent(contentEl, chat.id);
  });
}

function showChatMenu(chatId: string, _anchor: HTMLElement): void {
  const chat = getChatById(chatId);
  if (!chat) return;

  const action = prompt(
    '1 — Изменить аватар\n2 — Удалить чат\n3 — Участники\nОтмена — закрыть',
    '1'
  );
  if (action === null) return;

  if (action === '1') {
    const url = prompt('URL аватара', chat.avatar || '');
    if (url !== null) {
      updateChatAvatar(chatId, url);
      renderChatList(listEl!, activeChatId);
      if (activeChatId === chatId) renderChatContent(contentEl!, chatId);
    }
  } else if (action === '2') {
    if (confirm(`Удалить чат «${chat.name}»?`)) {
      deleteChat(chatId);
      if (activeChatId === chatId) {
        activeChatId = null;
        renderChatContent(contentEl!, null);
      }
      renderChatList(listEl!, activeChatId);
    }
  } else if (action === '3') {
    let usersList = chat.users.join(', ');
    const act = prompt(`Участники: ${usersList}\nДобавить (введите имя) или удалить (введите минус и имя, например -Иван)`);
    if (act == null) return;
    if (act.startsWith('-')) {
      const name = act.slice(1).trim();
      removeUserFromChat(chatId, name);
    } else if (act.trim()) {
      addUserToChat(chatId, act.trim());
    }
    if (activeChatId === chatId) renderChatContent(contentEl!, chatId);
  }
}

let listEl: HTMLElement | null = null;
let contentEl: HTMLDivElement | null = null;
let activeChatId: string | null = null;
let onChatSelect: (id: string) => void = () => {};

function renderChatContent(content: HTMLDivElement, chatId: string | null): void {
  if (!chatId) {
    content.innerHTML = emptyStateHtml;
    return;
  }

  const chat = getChatById(chatId);
  if (!chat) {
    content.innerHTML = emptyStateHtml;
    return;
  }

  const messagesHtml = chat.messages
    .map(
      (m) => `
    <div class="chat-messages__item chat-messages__item--${m.author === 'me' ? 'me' : 'them'}">
      <div class="chat-messages__bubble">
        <div class="chat-messages__text">${escapeHtml(m.text)}</div>
        <div class="chat-messages__time">${m.time}</div>
      </div>
    </div>
  `
    )
    .join('');

  const usersList = chat.users.map((u) => escapeHtml(u)).join(', ');

  content.innerHTML = `
    <div class="chat-content__toolbar">
      <h2 class="chat-content__title">${escapeHtml(chat.name)}</h2>
      <div class="chat-content__meta">Участники: ${usersList}</div>
      <button type="button" class="chat-content__btn" data-action="chat-avatar">Аватар</button>
      <button type="button" class="chat-content__btn" data-action="chat-users">Участники</button>
      <button type="button" class="chat-content__btn chat-content__btn--danger" data-action="chat-delete">Удалить чат</button>
    </div>
    <div class="chat-messages">
      ${messagesHtml}
    </div>
    <form class="chat-send" data-chat-id="${escapeHtml(chatId)}">
      <input type="text" class="chat-send__input" placeholder="Сообщение" name="message" autocomplete="off" />
      <button type="submit" class="chat-send__submit">Отправить</button>
    </form>
  `;

  content.querySelector('.chat-messages')?.scrollTo(0, 1e9);

  content.querySelector('[data-action="chat-avatar"]')?.addEventListener('click', () => {
    const url = prompt('URL аватара', chat.avatar || '');
    if (url !== null) {
      updateChatAvatar(chatId, url);
      renderChatList(listEl!, activeChatId);
      renderChatContent(content, chatId);
    }
  });

  content.querySelector('[data-action="chat-users"]')?.addEventListener('click', () => {
    const act = prompt('Добавить (имя) или удалить (-имя)');
    if (act == null) return;
    if (act.startsWith('-')) removeUserFromChat(chatId, act.slice(1).trim());
    else if (act.trim()) addUserToChat(chatId, act.trim());
    renderChatContent(content, chatId);
  });

  content.querySelector('[data-action="chat-delete"]')?.addEventListener('click', () => {
    if (confirm(`Удалить чат «${chat.name}»?`)) {
      deleteChat(chatId);
      activeChatId = null;
      renderChatList(listEl!, null);
      renderChatContent(content, null);
    }
  });

  content.querySelector('.chat-send')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input[name="message"]') as HTMLInputElement;
    const text = input?.value?.trim();
    if (!text) return;
    sendMessage(chatId, text);
    input.value = '';
    renderChatContent(content, chatId);
  });
}

function initChatSidebarItems(): void {
  listEl =
    (document.querySelector('.chat-sidebar__list') as HTMLElement | null) ??
    (document.querySelector('.chat-sidebar') as HTMLElement | null);
  contentEl = document.querySelector('.chat-content') as HTMLDivElement | null;

  if (!listEl || !contentEl) return;

  onChatSelect = (id: string) => {
    activeChatId = id;
    listEl!.querySelectorAll('.chat-sidebar__item').forEach((el) => {
      el.classList.toggle('active', (el as HTMLElement).dataset.chatId === id);
    });
    renderChatContent(contentEl!, id);
  };

  attachNewChatButton();
  renderChatList(listEl, activeChatId);
}

initChatSidebarItems();

export { renderChatList, renderChatContent, initChatSidebarItems };
