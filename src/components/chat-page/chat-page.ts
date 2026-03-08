import "./__header/chat-page__header.ts";
import "./__sidebar/__search/chat-page__sidebar-search.ts";
import "./__content/__empty-state/chat-page__content-empty.ts";
import { initChatSidebarItems } from "./__sidebar/__chat-item/chat-page__sidebar-chat-item.ts";

export function initChatPage(): void {
  initChatSidebarItems();
}
