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

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${API_URL}/user/avatar`;

    xhr.open('PUT', url);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const raw = response.user ?? response;
          resolve(normalizeUser(raw as IUser & { id?: string | number }));
        } catch {
          reject(new Error('Failed to parse avatar response'));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during avatar upload'));
    xhr.ontimeout = () => reject(new Error('Avatar upload timeout'));

    xhr.send(formData);
  });
}
