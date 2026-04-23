export interface ILoginRequest {
  login: string;
  password: string;
}

export interface IRegisterRequest {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  password: string;
}

export interface IUser {
  id: string;
  first_name: string;
  second_name: string;
  display_name?: string;
  login: string;
  email: string;
  phone: string;
  avatar?: string;
}

export function normalizeUser(u: IUser & { id?: string | number }): IUser {
  return { ...u, id: String(u.id), avatar: normalizeAvatarUrl(u.avatar) };
}

function normalizeAvatarUrl(avatar: unknown): string | undefined {
  if (!avatar || typeof avatar !== "string") return undefined;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;

  const base = "https://ya-praktikum.tech/api/v2";

  if (avatar.startsWith("/resources/")) return `${base}${avatar}`;
  if (avatar.startsWith("/")) return `${base}/resources${avatar}`;

  return `${base}/resources/${avatar}`;
}

export interface IUpdateProfileRequest {
  first_name: string;
  second_name: string;
  display_name?: string;
  login: string;
  email: string;
  phone: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface IChat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

export interface IChatMessage {
  id: string;
  author: "me" | "them";
  text: string;
  time: string;
}

export interface IChatUser {
  id: string;
  login: string;
  first_name?: string;
  second_name?: string;
  display_name?: string;
  avatar?: string;
}

