import type { IChat, IChatMessage } from "../types/domains";
import {
  getChats as getChatsApi,
  getMessages as getMessagesApi,
  sendMessage as sendMessageApi,
  createChat as createChatApi,
  addUsersToChat as addUsersToChatApi,
  removeUsersFromChat as removeUsersFromChatApi,
  uploadChatAvatar as uploadChatAvatarApi,
} from "../api/chat.api";
import { authModel } from "./auth.model";

function mapChat(apiChat: {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message?: {
    content: string;
    time: string;
    user: { login: string };
  };
}): IChat {
  return {
    id: String(apiChat.id),
    name: apiChat.title,
    lastMessage: apiChat.last_message?.content ?? "",
    time: apiChat.last_message?.time ?? "",
    unread: apiChat.unread_count,
    avatar: apiChat.avatar ?? "",
  };
}

export class ChatModel {
  public async getChats(): Promise<IChat[]> {
    const apiChats = await getChatsApi();
    return apiChats.map(mapChat);
  }

  public async getMessages(chatId: string): Promise<IChatMessage[]> {
    const apiMessages = await getMessagesApi(Number(chatId));
    const currentUser = await authModel.getCurrentUser();
    const currentUserId = currentUser?.id;

    return apiMessages.map((msg) => ({
      id: String(msg.id),
      author: msg.sender_id === Number(currentUserId) ? "me" : "them",
      text: msg.content,
      time: msg.time,
    }));
  }

  public async sendMessage(chatId: string, text: string): Promise<IChatMessage> {
    const apiMessage = await sendMessageApi(Number(chatId), text);
    
    return {
      id: String(apiMessage.id),
      author: "me",
      text: apiMessage.content,
      time: apiMessage.time,
    };
  }

  public async createChat(title: string, userIds?: number[]): Promise<IChat> {
    const apiChat = await createChatApi({ title, users: userIds });
    return mapChat({ ...apiChat, last_message: undefined });
  }

  public async addUsersToChat(chatId: string, userIds: number[]): Promise<void> {
    await addUsersToChatApi(Number(chatId), userIds);
  }

  public async removeUsersFromChat(chatId: string, userIds: number[]): Promise<void> {
    await removeUsersFromChatApi(Number(chatId), userIds);
  }

  public async uploadChatAvatar(chatId: string, file: File): Promise<void> {
    await uploadChatAvatarApi(Number(chatId), file);
  }
}

export const chatModel = new ChatModel();

