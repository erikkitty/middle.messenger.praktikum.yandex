import template from "./chat-page.hbs?raw";
import "./chat-page.scss";
import { Block } from "../../core/Block";
import type { IChat, IChatMessage, IChatUser } from "../../types/domains";
import { ChatMessage } from "../../components/chat-message/chat-message";
import { router } from "../../core/Router";

export interface ChatPageProps {
  chats?: IChat[];
  currentChatId?: string | null;
  currentChatTitle?: string;
  participants?: IChatUser[];
  messages?: IChatMessage[];
  error?: string;
  onSendMessage?: (text: string) => void;
  onChatSelect?: (chatId: string) => void;
  onCreateChat?: (title: string) => void;
  onAddParticipant?: (login: string) => void;
  onRemoveParticipant?: (login: string) => void;
  onDeleteChat?: () => void;
}

export class ChatPage extends Block<ChatPageProps> {
  private handleChatClick: ((e: Event) => void) | null = null;
  private handleSendSubmit: ((e: Event) => void) | null = null;
  private handleSendKeyDown: ((e: KeyboardEvent) => void) | null = null;
  private handleCreateChatClick: (() => void) | null = null;
  private handleAddParticipantClick: (() => void) | null = null;
  private handleRemoveParticipantClick: (() => void) | null = null;
  private handleDeleteChatClick: (() => void) | null = null;

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
      participants: this.props.participants ?? [],
      messageComponents,
    });
  }

  protected componentDidMount(): void {
    const root = this.element;
    if (!root) return;

    const profileBtn = root.querySelector('[data-action="open-profile"]');
    profileBtn?.addEventListener("click", () => {
      router.navigate("/settings");
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
    const sendMessage = (form: HTMLFormElement): void => {
      const input = form.querySelector<HTMLInputElement>('input[name="message"]');
      const text = input?.value?.trim() ?? "";
      if (!text) return;
      this.props.onSendMessage?.(text);
      if (input) input.value = "";
    };

    this.handleSendSubmit = (e: Event) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      sendMessage(form);
    };
    sendForm?.addEventListener("submit", this.handleSendSubmit);

    const sendInput =
      sendForm?.querySelector<HTMLInputElement>('input[name="message"]') ?? null;

    this.handleSendKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (e.shiftKey) return;
      if (e.isComposing) return;
      e.preventDefault();
      const form = sendForm as HTMLFormElement | null;
      if (!form) return;
      sendMessage(form);
    };

    sendInput?.addEventListener("keydown", this.handleSendKeyDown);

    const newChatBtn = root.querySelector('[data-action="new-chat"]');
    this.handleCreateChatClick = () => {
      const title = prompt("Название чата");
      if (!title || !title.trim()) return;
      this.props.onCreateChat?.(title.trim());
    };
    newChatBtn?.addEventListener("click", this.handleCreateChatClick);

    const addParticipantBtn = root.querySelector('[data-action="add-user"]');
    this.handleAddParticipantClick = () => {
      const login = prompt("Логин участника");
      if (!login || !login.trim()) return;
      this.props.onAddParticipant?.(login.trim());
    };
    addParticipantBtn?.addEventListener("click", this.handleAddParticipantClick);

    const removeParticipantBtn = root.querySelector('[data-action="remove-user"]');
    this.handleRemoveParticipantClick = () => {
      const login = prompt("Логин участника");
      if (!login || !login.trim()) return;
      this.props.onRemoveParticipant?.(login.trim());
    };
    removeParticipantBtn?.addEventListener(
      "click",
      this.handleRemoveParticipantClick,
    );

    const deleteChatBtn = root.querySelector('[data-action="delete-chat"]');
    this.handleDeleteChatClick = () => {
      if (!confirm("Удалить чат?")) return;
      this.props.onDeleteChat?.();
    };
    deleteChatBtn?.addEventListener("click", this.handleDeleteChatClick);

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

    const sendInput =
      sendForm?.querySelector<HTMLInputElement>('input[name="message"]') ?? null;
    if (sendInput && this.handleSendKeyDown) {
      sendInput.removeEventListener("keydown", this.handleSendKeyDown);
    }

    const newChatBtn = root.querySelector('[data-action="new-chat"]');
    if (newChatBtn && this.handleCreateChatClick) {
      newChatBtn.removeEventListener("click", this.handleCreateChatClick);
    }

    const addParticipantBtn = root.querySelector('[data-action="add-user"]');
    if (addParticipantBtn && this.handleAddParticipantClick) {
      addParticipantBtn.removeEventListener("click", this.handleAddParticipantClick);
    }

    const removeParticipantBtn = root.querySelector('[data-action="remove-user"]');
    if (removeParticipantBtn && this.handleRemoveParticipantClick) {
      removeParticipantBtn.removeEventListener(
        "click",
        this.handleRemoveParticipantClick,
      );
    }

    const deleteChatBtn = root.querySelector('[data-action="delete-chat"]');
    if (deleteChatBtn && this.handleDeleteChatClick) {
      deleteChatBtn.removeEventListener("click", this.handleDeleteChatClick);
    }

    this.handleChatClick = null;
    this.handleSendSubmit = null;
    this.handleSendKeyDown = null;
    this.handleCreateChatClick = null;
    this.handleAddParticipantClick = null;
    this.handleRemoveParticipantClick = null;
    this.handleDeleteChatClick = null;
  }
}
