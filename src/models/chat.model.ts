import type { IChat, IChatMessage, IChatUser } from "../types/domains";
import {
  getChats as getChatsApi,
  createChat as createChatApi,
  deleteChat as deleteChatApi,
  addUsersToChat as addUsersToChatApi,
  removeUsersFromChat as removeUsersFromChatApi,
  uploadChatAvatar as uploadChatAvatarApi,
  getChatUsers as getChatUsersApi,
  getChatToken as getChatTokenApi,
  CHAT_WS_BASE_URL,
} from "../api/chat.api";
import { authModel } from "./auth.model";
import { formatChatTime } from "../utils/datetime";

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
    time: apiChat.last_message?.time ? formatChatTime(apiChat.last_message.time) : "",
    unread: apiChat.unread_count,
    avatar: apiChat.avatar ?? "",
  };
}

export class ChatModel {
  private socket: WebSocket | null = null;
  private socketChatId: string | null = null;
  private messages: IChatMessage[] = [];
  private listeners = new Set<(messages: IChatMessage[]) => void>();
  private connectSeq = 0;
  private pingTimer: ReturnType<typeof setInterval> | null = null;

  public async getChats(): Promise<IChat[]> {
    const apiChats = await getChatsApi();
    return apiChats.map(mapChat);
  }

  public subscribe(listener: (messages: IChatMessage[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.messages]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    const snapshot = [...this.messages];
    this.listeners.forEach((l) => l(snapshot));
  }

  private closeSocket(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }

    if (!this.socket) return;
    try {
      this.socket.close();
    } catch {
      // ignore
    }
    this.socket = null;
  }

  public disconnect(): void {
    this.connectSeq += 1;
    this.closeSocket();
    this.socketChatId = null;
    this.messages = [];
    this.emit();
  }

  public async selectChat(chatId: string): Promise<IChatMessage[]> {
    if (
      this.socketChatId === chatId &&
      this.socket?.readyState === WebSocket.OPEN
    ) {
      return [...this.messages];
    }

    this.connectSeq += 1;
    const seq = this.connectSeq;

    this.closeSocket();
    this.socketChatId = chatId;
    this.messages = [];
    this.emit();

    const currentUser = await authModel.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error("Р СџР С•Р В»РЎРЉР В·Р С•Р Р†Р В°РЎвЂљР ВµР В»РЎРЉ Р Р…Р Вµ Р В°Р Р†РЎвЂљР С•РЎР‚Р С‘Р В·Р С•Р Р†Р В°Р Р…");
    }

    const token = await getChatTokenApi(Number(chatId));
    if (!token?.token) {
      throw new Error("Р СњР Вµ РЎС“Р Т‘Р В°Р В»Р С•РЎРѓРЎРЉ Р С—Р С•Р В»РЎС“РЎвЂЎР С‘РЎвЂљРЎРЉ РЎвЂљР С•Р С”Р ВµР Р… РЎвЂЎР В°РЎвЂљР В°");
    }

    const wsUrl = `${CHAT_WS_BASE_URL}/${currentUser.id}/${chatId}/${token.token}`;
    const socket = new WebSocket(wsUrl);
    this.socket = socket;

    const oldMessages = await new Promise<IChatMessage[]>((resolve, reject) => {
      let resolved = false;
      const initTimeoutMs = 10000;
      const initTimeout = setTimeout(() => {
        if (resolved) return;
        resolved = true;
        cleanupAll();
        reject(new Error("Превышено время ожидания подключения к чату"));
      }, initTimeoutMs);

      const cleanupInit = () => {
        socket.removeEventListener("open", onOpen);
        socket.removeEventListener("error", onError);
        socket.removeEventListener("close", onCloseBeforeInit);
      };

      const cleanupAll = () => {
        cleanupInit();
        socket.removeEventListener("message", onMessage);
        clearTimeout(initTimeout);
      };

      const onError = () => {
        if (resolved) return;
        resolved = true;
        cleanupAll();
        reject(new Error("Ошибка WebSocket соединения"));
      };

      const onCloseBeforeInit = () => {
        if (resolved) return;
        resolved = true;
        cleanupAll();
        reject(new Error("WebSocket соединение было закрыто"));
      };

      const onOpen = () => {
        try {
          socket.send(JSON.stringify({ content: "0", type: "get old" }));
        } catch {
          // ignore
        }

        if (this.pingTimer) {
          clearInterval(this.pingTimer);
        }

        this.pingTimer = setInterval(() => {
          if (socket.readyState !== WebSocket.OPEN) return;
          try {
            socket.send(JSON.stringify({ type: "ping" }));
          } catch {
            // ignore
          }
        }, 30000);
      };

      const onMessage = (event: MessageEvent) => {
        if (seq !== this.connectSeq) return;

        const parsed = safeJsonParse(event.data);
        if (parsed === null) return;

        if (Array.isArray(parsed)) {
          const mapped = parsed
            .map((m) => toWsMessage(m))
            .filter((m): m is WsChatMessage => Boolean(m))
            .map((m) => toDomainMessage(m, currentUser.id))
            .filter((m): m is IChatMessage => Boolean(m))
            .reverse();

          if (!resolved) {
            resolved = true;
            cleanupInit();
            clearTimeout(initTimeout);
            resolve(mapped);
            return;
          }

          this.messages = mapped;
          this.emit();
          return;
        }

        const raw = toWsMessage(parsed);
        if (!raw) return;
        if (raw.type && raw.type !== "message") return;

        const domain = toDomainMessage(raw, currentUser.id);
        if (!domain) return;
        this.messages = [...this.messages, domain];
        this.emit();
      };

      const onClose = () => {
        if (this.pingTimer) {
          clearInterval(this.pingTimer);
          this.pingTimer = null;
        }
      };

      socket.addEventListener("open", onOpen);
      socket.addEventListener("error", onError);
      socket.addEventListener("close", onCloseBeforeInit);
      socket.addEventListener("message", onMessage);
      socket.addEventListener("close", onClose);
    });

    if (seq !== this.connectSeq) return [];

    this.messages = oldMessages;
    this.emit();
    return [...this.messages];
  }

  public async send(text: string): Promise<void> {
    const socket = this.socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error("Р В§Р В°РЎвЂљ Р Р…Р Вµ Р С—Р С•Р Т‘Р С”Р В»РЎР‹РЎвЂЎР ВµР Р…");
    }

    socket.send(JSON.stringify({ content: text, type: "message" }));
  }

  public async createChat(title: string, userIds?: number[]): Promise<IChat> {
    const apiChat = await createChatApi({ title, users: userIds });
    return mapChat({ ...apiChat, last_message: undefined });
  }

  public async deleteChat(chatId: string): Promise<void> {
    await deleteChatApi(Number(chatId));
  }

  public async addUsersToChat(chatId: string, userIds: number[]): Promise<void> {
    await addUsersToChatApi(Number(chatId), userIds);
  }

  public async removeUsersFromChat(chatId: string, userIds: number[]): Promise<void> {
    await removeUsersFromChatApi(Number(chatId), userIds);
  }

  public async getChatUsers(chatId: string): Promise<IChatUser[]> {
    const users = await getChatUsersApi(Number(chatId));
    return users.map((user) => ({
      id: String(user.id),
      login: user.login,
      first_name: user.first_name,
      second_name: user.second_name,
      display_name: user.display_name,
      avatar: user.avatar ?? undefined,
    }));
  }

  public async uploadChatAvatar(chatId: string, file: File): Promise<void> {
    await uploadChatAvatarApi(Number(chatId), file);
  }
}

export const chatModel = new ChatModel();

type WsChatMessage = {
  id?: number | string;
  type?: string;
  content?: unknown;
  time?: unknown;
  user_id?: unknown;
  sender_id?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function safeJsonParse(data: unknown): unknown | null {
  try {
    return JSON.parse(String(data));
  } catch {
    return null;
  }
}

function toWsMessage(value: unknown): WsChatMessage | null {
  if (!isRecord(value)) return null;
  return value as WsChatMessage;
}

function toDomainMessage(
  raw: WsChatMessage,
  currentUserId: string,
): IChatMessage | null {
  const text = typeof raw.content === "string" ? raw.content : null;
  const timeRaw = typeof raw.time === "string" ? raw.time : "";
  const time = timeRaw ? formatChatTime(timeRaw) : "";
  const userIdRaw = raw.user_id ?? raw.sender_id;
  const userId =
    userIdRaw !== undefined && userIdRaw !== null ? String(userIdRaw) : "";

  if (!text) return null;

  const id =
    raw.id !== undefined && raw.id !== null
      ? String(raw.id)
      : `tmp_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  return {
    id,
    author: userId === currentUserId ? "me" : "them",
    text,
    time,
  };
}



