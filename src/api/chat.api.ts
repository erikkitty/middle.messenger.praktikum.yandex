import { HttpClient } from '../utils/http';

const API_URL = 'https://ya-praktikum.tech/api/v2/';

const http = new HttpClient(API_URL);

export interface IChat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: number;
  last_message?: {
    id: number;
    content: string;
    time: string;
    user: {
      id: number;
      login: string;
      avatar: string | null;
    };
  };
}

export interface IChatMessage {
  id: number;
  content: string;
  time: string;
  chat_id: number;
  sender_id: number;
  user: {
    id: number;
    login: string;
    avatar: string | null;
    first_name: string;
    second_name: string;
  };
  is_read: boolean;
}

export interface ICreateChatRequest {
  title: string;
  users?: number[];
}

export interface ICreateChatResponse {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: number;
}

export async function getChats(): Promise<IChat[]> {
  return http.get<IChat[]>('chats');
}

export async function createChat(data: ICreateChatRequest): Promise<ICreateChatResponse> {
  return http.post<ICreateChatResponse>('chats', data);
}

export async function deleteChat(chatId: number): Promise<void> {
  return http.delete<void>("chats", { chatId });
}

export interface IChatTokenResponse {
  token: string;
}

export async function getChatToken(chatId: number): Promise<IChatTokenResponse> {
  return http.post<IChatTokenResponse>(`chats/token/${chatId}`);
}

export const CHAT_WS_BASE_URL = "wss://ya-praktikum.tech/ws/chats";

export async function addUsersToChat(chatId: number, userIds: number[]): Promise<void> {
  return http.put<void>(`chats/users`, { users: userIds, chatId });
}

export async function removeUsersFromChat(chatId: number, userIds: number[]): Promise<void> {
  return http.delete<void>(`chats/users`, { users: userIds, chatId });
}

export async function uploadChatAvatar(chatId: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('chatId', String(chatId));

  await http.put<void>("chats/avatar", formData);
}

export interface IChatUserResponse {
  id: number;
  login: string;
  first_name?: string;
  second_name?: string;
  display_name?: string;
  avatar?: string | null;
}

export async function getChatUsers(chatId: number): Promise<IChatUserResponse[]> {
  return http.get<IChatUserResponse[]>(`chats/${chatId}/users`);
}
