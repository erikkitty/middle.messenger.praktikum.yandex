export interface ChatMessage {
  id: string;
  author: "me" | "them";
  text: string;
  time: string;
}

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  messages: ChatMessage[];
  users: string[];
}

let lastId = 10;
let lastMsgId = 100;

function nextId(): string {
  return String(++lastId);
}
function nextMsgId(): string {
  return "m" + ++lastMsgId;
}

function nowTime(): string {
  const d = new Date();
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export const mockChats: Chat[] = [
  {
    id: "1",
    name: "Андрей",
    lastMessage: "Изображение",
    time: "10:49",
    unread: 2,
    avatar: "",
    users: ["Андрей"],
    messages: [
      {
        id: "m1",
        author: "them",
        text: "Привет! Отправил тебе изображение.",
        time: "10:40",
      },
      { id: "m2", author: "me", text: "Вижу, спасибо!", time: "10:45" },
      { id: "m3", author: "them", text: "Как тебе?", time: "10:49" },
    ],
  },
  {
    id: "2",
    name: "Киноклуб",
    lastMessage: "Вы: спикер",
    time: "12:00",
    unread: 0,
    avatar: "",
    users: ["Участник 1", "Участник 2"],
    messages: [
      {
        id: "m4",
        author: "them",
        text: "Напоминаю: сегодня встреча киноклуба.",
        time: "11:30",
      },
      { id: "m5", author: "me", text: "Ок, буду!", time: "11:45" },
      { id: "m6", author: "them", text: "Вы: спикер", time: "12:00" },
    ],
  },
  {
    id: "3",
    name: "Илья",
    lastMessage: "Друзья, у меня для вас особенный выпуск новостей...",
    time: "15:12",
    unread: 4,
    avatar: "",
    users: ["Илья"],
    messages: [
      {
        id: "m7",
        author: "them",
        text: "Друзья, у меня для вас особенный выпуск новостей...",
        time: "15:12",
      },
      { id: "m8", author: "me", text: "Жду!", time: "15:20" },
    ],
  },
  {
    id: "4",
    name: "Вадим",
    lastMessage: "Круто!",
    time: "Пн",
    unread: 0,
    avatar: "",
    users: ["Вадим"],
    messages: [
      { id: "m9", author: "me", text: "Работу выполнил", time: "Пн" },
      { id: "m10", author: "them", text: "Круто!", time: "Пн" },
    ],
  },
];

export function getChats(): Chat[] {
  return mockChats;
}

export function createChat(name: string): Chat {
  const chat: Chat = {
    id: nextId(),
    name: name.trim() || "Новый чат",
    lastMessage: "",
    time: nowTime(),
    unread: 0,
    avatar: "",
    messages: [],
    users: [name.trim() || "Участник"],
  };
  mockChats.push(chat);
  return chat;
}

export function deleteChat(id: string): void {
  const i = mockChats.findIndex((c) => c.id === id);
  if (i !== -1) mockChats.splice(i, 1);
}

export function updateChatAvatar(id: string, avatarUrl: string): void {
  const chat = mockChats.find((c) => c.id === id);
  if (chat) chat.avatar = avatarUrl;
}

export function addUserToChat(chatId: string, userName: string): void {
  const chat = mockChats.find((c) => c.id === chatId);
  if (chat && userName.trim() && !chat.users.includes(userName.trim())) {
    chat.users.push(userName.trim());
  }
}

export function removeUserFromChat(chatId: string, userName: string): void {
  const chat = mockChats.find((c) => c.id === chatId);
  if (chat) {
    chat.users = chat.users.filter((u) => u !== userName);
  }
}

export function sendMessage(chatId: string, text: string): void {
  const chat = mockChats.find((c) => c.id === chatId);
  if (!chat || !text.trim()) return;
  const msg: ChatMessage = {
    id: nextMsgId(),
    author: "me",
    text: text.trim(),
    time: nowTime(),
  };
  chat.messages.push(msg);
  chat.lastMessage =
    text.trim().slice(0, 50) + (text.trim().length > 50 ? "..." : "");
  chat.time = msg.time;
}

export function getChatById(id: string): Chat | undefined {
  return mockChats.find((c) => c.id === id);
}
