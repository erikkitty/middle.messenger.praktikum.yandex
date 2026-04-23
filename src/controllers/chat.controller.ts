import { chatModel } from '../models/chat.model';
import { ChatPage } from '../pages/chat-page/chat-page';
import type { IChat, IChatUser } from "../types/domains";
import { searchUsersByLogin } from "../api/user.api";

export class ChatController {
  private view: ChatPage | null = null;
  private currentChatId: string | null = null;
  private currentChatTitle: string = "";
  private chats: IChat[] = [];
  private participants: IChatUser[] = [];
  private unsubscribe: (() => void) | null = null;

  private ensureView(): ChatPage {
    if (!this.view) {
      this.view = new ChatPage({
        onSendMessage: (text) => this.handleSendMessage(text),
        onChatSelect: (chatId) => this.handleChatSelect(chatId),
        onCreateChat: (title) => this.handleCreateChat(title),
        onAddParticipant: (login) => void this.handleAddParticipant(login),
        onRemoveParticipant: (login) => void this.handleRemoveParticipant(login),
        onDeleteChat: () => void this.handleDeleteChat(),
      });

      if (!this.unsubscribe) {
        this.unsubscribe = chatModel.subscribe((messages) => {
          this.view?.setProps({
            messages,
            currentChatId: this.currentChatId,
            currentChatTitle: this.currentChatTitle,
            participants: this.participants,
          });
        });
      }
    }
    return this.view;
  }

  public async init(): Promise<void> {
    this.view = null;
    this.currentChatId = null;
    this.currentChatTitle = "";
    this.chats = [];
    this.participants = [];
    chatModel.disconnect();
    
    try {
      const chats = await chatModel.getChats();
      this.chats = chats;
      this.ensureView().setProps({
        chats,
        currentChatId: null,
        currentChatTitle: "",
        participants: [],
        messages: [],
      });
    } catch (error) {
      this.ensureView().setProps({ 
        error: error instanceof Error ? error.message : 'Ошибка загрузки чатов' 
      });
    }
  }

  private async handleChatSelect(chatId: string): Promise<void> {
    this.currentChatId = chatId;
    this.currentChatTitle = this.chats.find((c) => c.id === chatId)?.name ?? "Chat";
    
    try {
      this.ensureView().setProps({
        currentChatId: chatId,
        currentChatTitle: this.currentChatTitle,
        participants: [],
        error: undefined,
      });
      await Promise.all([
        chatModel.selectChat(chatId),
        this.loadParticipants(chatId),
      ]);
    } catch (error) {
      this.ensureView().setProps({ 
        error: error instanceof Error ? error.message : 'Ошибка загрузки сообщений' 
      });
    }
  }

  private async handleSendMessage(text: string): Promise<void> {
    if (!this.currentChatId) return;

    try {
      await chatModel.send(text);
    } catch (error) {
      this.ensureView().setProps({ 
        error: error instanceof Error ? error.message : 'Ошибка отправки' 
      });
    }
  }

  private async handleCreateChat(title: string): Promise<void> {
    try {
      const created = await chatModel.createChat(title);
      const chats = await chatModel.getChats();
      this.currentChatId = created.id;
      this.chats = chats;
      this.currentChatTitle =
        chats.find((c) => c.id === created.id)?.name ?? title;
      this.ensureView().setProps({
        chats,
        currentChatId: created.id,
        currentChatTitle: this.currentChatTitle,
        participants: [],
        messages: [],
      });
      await Promise.all([
        chatModel.selectChat(created.id),
        this.loadParticipants(created.id),
      ]);
    } catch (error) {
      this.ensureView().setProps({
        error: error instanceof Error ? error.message : "Ошибка создания чата",
      });
    }
  }

  private async handleAddParticipant(login: string): Promise<void> {
    if (!this.currentChatId) return;

    try {
      const userId = await this.getUserIdByLogin(login);
      await chatModel.addUsersToChat(this.currentChatId, [userId]);
      await this.loadParticipants(this.currentChatId);
    } catch (error) {
      this.ensureView().setProps({
        error: error instanceof Error ? error.message : "Не удалось добавить пользователя",
      });
    }
  }

  private async handleRemoveParticipant(login: string): Promise<void> {
    if (!this.currentChatId) return;

    try {
      const userId = await this.getUserIdByLogin(login);
      await chatModel.removeUsersFromChat(this.currentChatId, [userId]);
      await this.loadParticipants(this.currentChatId);
    } catch (error) {
      this.ensureView().setProps({
        error: error instanceof Error ? error.message : "Не удалось удалить пользователя",
      });
    }
  }

  private async getUserIdByLogin(login: string): Promise<number> {
    const users = await searchUsersByLogin(login);
    if (!users.length) {
      throw new Error("Пользователь не найден");
    }

    const user = users.find((u) => u.login === login) ?? users[0];
    const userId = Number(user.id);
    if (!Number.isFinite(userId)) {
      throw new Error("Некорректный id пользователя");
    }

    return userId;
  }

  private async handleDeleteChat(): Promise<void> {
    if (!this.currentChatId) return;

    try {
      await chatModel.deleteChat(this.currentChatId);
      chatModel.disconnect();

      const chats = await chatModel.getChats();
      this.chats = chats;
      this.currentChatId = null;
      this.currentChatTitle = "";
      this.participants = [];

      this.ensureView().setProps({
        chats,
        currentChatId: null,
        currentChatTitle: "",
        participants: [],
        messages: [],
      });
    } catch (error) {
      this.ensureView().setProps({
        error: error instanceof Error ? error.message : "Failed to delete chat",
      });
    }
  }

  public getView(): ChatPage {
    return this.ensureView();
  }

  private async loadParticipants(chatId: string): Promise<void> {
    const participants = await chatModel.getChatUsers(chatId);
    if (this.currentChatId !== chatId) return;

    this.participants = participants;
    this.ensureView().setProps({ participants });
  }
}

export const chatController = new ChatController();
