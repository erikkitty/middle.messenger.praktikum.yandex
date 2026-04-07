import type { IChat, IChatMessage } from "../types/domains";
import {
  getChats as getMockChats,
  getChatById,
  sendMessage as sendMockMessage,
} from "../pages/chat-page/mock-chat";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ChatModel {
  public async getChats(): Promise<IChat[]> {
    await delay(150);
    return getMockChats().map((c) => ({
      id: c.id,
      name: c.name,
      lastMessage: c.lastMessage,
      time: c.time,
      unread: c.unread,
      avatar: c.avatar,
    }));
  }

  public async getMessages(chatId: string): Promise<IChatMessage[]> {
    await delay(150);
    const chat = getChatById(chatId);
    if (!chat) return [];
    return chat.messages.map((m) => ({
      id: m.id,
      author: m.author,
      text: m.text,
      time: m.time,
    }));
  }

  public async sendMessage(chatId: string, text: string): Promise<IChatMessage> {
    await delay(100);
    sendMockMessage(chatId, text);
    const chat = getChatById(chatId);
    const last = chat && chat.messages.length ? chat.messages[chat.messages.length - 1] : undefined;
    if (!last) {
      throw new Error("Не удалось отправить сообщение");
    }
    return {
      id: last.id,
      author: last.author,
      text: last.text,
      time: last.time,
    };
  }
}

export const chatModel = new ChatModel();

