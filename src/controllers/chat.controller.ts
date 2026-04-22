import { chatModel } from '../models/chat.model';
import { ChatPage } from '../pages/chat-page/chat-page';
import type { IChatMessage } from '../types/domains';

export class ChatController {
  private view: ChatPage | null = null;
  private currentChatId: string | null = null;
  private messages: IChatMessage[] = [];

  private ensureView(): ChatPage {
    if (!this.view) {
      this.view = new ChatPage({
        onSendMessage: (text) => this.handleSendMessage(text),
        onChatSelect: (chatId) => this.handleChatSelect(chatId),
        onCreateChat: (title) => this.handleCreateChat(title),
      });
    }
    return this.view;
  }

  public async init(): Promise<void> {
    this.view = null;
    this.currentChatId = null;
    this.messages = [];
    
    try {
      const chats = await chatModel.getChats();
      this.ensureView().setProps({ chats, currentChatId: null, messages: [] });
    } catch (error) {
      this.ensureView().setProps({ 
        error: error instanceof Error ? error.message : 'Ошибка загрузки чатов' 
      });
    }
  }

  private async handleChatSelect(chatId: string): Promise<void> {
    this.currentChatId = chatId;
    
    try {
      const messages = await chatModel.getMessages(chatId);
      this.messages = messages;
      this.ensureView().setProps({ messages, currentChatId: chatId });
    } catch (error) {
      this.ensureView().setProps({ 
        error: error instanceof Error ? error.message : 'Ошибка загрузки сообщений' 
      });
    }
  }

  private async handleSendMessage(text: string): Promise<void> {
    if (!this.currentChatId) return;

    try {
      const newMessage = await chatModel.sendMessage(this.currentChatId, text);
      const messages = this.messages;
      this.messages = [...messages, newMessage];
      this.ensureView().setProps({ 
        messages: this.messages,
      });
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
      this.messages = [];
      this.ensureView().setProps({
        chats,
        currentChatId: created.id,
        messages: [],
      });
    } catch (error) {
      this.ensureView().setProps({
        error: error instanceof Error ? error.message : "Ошибка создания чата",
      });
    }
  }

  public getView(): ChatPage {
    return this.ensureView();
  }
}

export const chatController = new ChatController();
