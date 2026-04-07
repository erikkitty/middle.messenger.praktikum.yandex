import template from "./chat-page.hbs?raw";
import "./chat-page.scss";
import { Block } from "../../core/Block";
import type { IChat, IChatMessage } from "../../types/domains";
import { ChatMessage } from "../../components/chat-message/chat-message";

export interface ChatPageProps {
  chats?: IChat[];
  currentChatId?: string | null;
  messages?: IChatMessage[];
  error?: string;
  onSendMessage?: (text: string) => void;
  onChatSelect?: (chatId: string) => void;
}

export class ChatPage extends Block<ChatPageProps> {
  protected render(): void {
    const messages = this.props.messages ?? [];
    const messageComponents = messages.map(
      (m) =>
        new ChatMessage({
          text: m.text,
          time: m.time,
          isOwn: m.author === "me",
        }),
    );

    this.element = this.compile(template, {
      ...this.props,
      chats: this.props.chats ?? [],
      currentChatId: this.props.currentChatId ?? null,
      messageComponents,
    });
  }

  protected componentDidMount(): void {
    const root = this.element;
    if (!root) return;

    const profileBtn = root.querySelector('[data-action="open-profile"]');
    profileBtn?.addEventListener("click", () => {
      window.location.hash = "/settings";
    });
    void import("./__sidebar/__chat-item/chat-page__sidebar-chat-item.ts");
    void import("./__sidebar/__search/chat-page__sidebar-search.ts").catch(() => {});
  }
}

