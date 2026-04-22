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
  onCreateChat?: (title: string) => void;
}

export class ChatPage extends Block<ChatPageProps> {
  private handleChatClick: ((e: Event) => void) | null = null;
  private handleSendSubmit: ((e: Event) => void) | null = null;
  private handleCreateChatClick: (() => void) | null = null;

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

    const list = root.querySelector(".chat-sidebar__list");
    this.handleChatClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const item = target?.closest(".chat-sidebar__item") as HTMLElement | null;
      const chatId = item?.dataset.chatId;
      if (!chatId) return;
      this.props.onChatSelect?.(chatId);
    };
    list?.addEventListener("click", this.handleChatClick);

    const sendForm = root.querySelector('[data-action="send-message"]');
    this.handleSendSubmit = (e: Event) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const input = form.querySelector<HTMLInputElement>('input[name="message"]');
      const text = input?.value?.trim() ?? "";
      if (!text) return;
      this.props.onSendMessage?.(text);
      if (input) input.value = "";
    };
    sendForm?.addEventListener("submit", this.handleSendSubmit);

    const newChatBtn = root.querySelector('[data-action="new-chat"]');
    this.handleCreateChatClick = () => {
      const title = prompt("Название чата");
      if (!title || !title.trim()) return;
      this.props.onCreateChat?.(title.trim());
    };
    newChatBtn?.addEventListener("click", this.handleCreateChatClick);

    void import("./__sidebar/__search/chat-page__sidebar-search.ts").catch(() => {});
  }

  protected componentWillUnmount(): void {
    const root = this.element;
    if (!root) return;

    const list = root.querySelector(".chat-sidebar__list");
    if (list && this.handleChatClick) {
      list.removeEventListener("click", this.handleChatClick);
    }

    const sendForm = root.querySelector('[data-action="send-message"]');
    if (sendForm && this.handleSendSubmit) {
      sendForm.removeEventListener("submit", this.handleSendSubmit);
    }

    const newChatBtn = root.querySelector('[data-action="new-chat"]');
    if (newChatBtn && this.handleCreateChatClick) {
      newChatBtn.removeEventListener("click", this.handleCreateChatClick);
    }

    this.handleChatClick = null;
    this.handleSendSubmit = null;
    this.handleCreateChatClick = null;
  }
}

