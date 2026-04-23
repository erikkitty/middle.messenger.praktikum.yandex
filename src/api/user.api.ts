import { HttpClient } from '../utils/http';
import {
  type IChangePasswordRequest,
  type IUpdateProfileRequest,
  type IUser,
  normalizeUser,
} from '../types/domains';

const API_URL = 'https://ya-praktikum.tech/api/v2/';

const http = new HttpClient(API_URL);

export interface IAvatarResponse {
  user: IUser;
}

export async function updateProfile(data: IUpdateProfileRequest): Promise<IUser> {
  const user = await http.put<IUser & { id?: string | number }>('user/profile', data);
  return normalizeUser(user);
}

export async function changePassword(data: IChangePasswordRequest): Promise<void> {
  return http.put<void>('user/password', data);
}

export async function uploadAvatar(file: File): Promise<IUser> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await http.put<unknown>("user/profile/avatar", formData);
  const raw =
    response && typeof response === "object" && "user" in response
      ? (response as { user: IUser & { id?: string | number } }).user
      : (response as IUser & { id?: string | number });

  return normalizeUser(raw);
}

export async function searchUsersByLogin(login: string): Promise<IUser[]> {
  const users = await http.post<Array<IUser & { id?: string | number }>>(
    "user/search",
    { login },
  );
  return users.map(normalizeUser);
}
