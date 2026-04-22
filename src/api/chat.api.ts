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

export async function getMessages(chatId: number, limit: number = 50): Promise<IChatMessage[]> {
  return http.get<IChatMessage[]>(`chats/${chatId}/history`, { limit });
}

export async function sendMessage(chatId: number, content: string): Promise<IChatMessage> {
  return http.post<IChatMessage>(`chats/${chatId}`, { content });
}

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

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${API_URL}/chats/avatar`;

    xhr.open('PUT', url);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during avatar upload'));
    xhr.ontimeout = () => reject(new Error('Avatar upload timeout'));

    xhr.send(formData);
  });
}

export async function getChatUsers(chatId: number): Promise<{ id: number; login: string }[]> {
  return http.get<{ id: number; login: string }[]>(`chats/${chatId}/users`);
}
