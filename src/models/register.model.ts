import type { IRegisterRequest, IUser } from "../types/domains";
import { signUp } from "../api/auth.api";
import { ApiError } from "../utils/http";

const LS_USER_KEY = "app.user";

function saveUser(user: IUser): void {
  localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
}

export class RegisterModel {
  public async register(data: IRegisterRequest): Promise<IUser> {
    try {
      const response = await signUp(data);
      const user: IUser = {
        id: String(response.id),
        first_name: response.first_name,
        second_name: response.second_name,
        display_name: response.display_name,
        login: response.login,
        email: response.email,
        phone: response.phone,
      };
      saveUser(user);
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          throw new Error('Пользователь с таким логином уже существует');
        }
        if (error.status === 400 && error.data && typeof error.data === 'object' && 'reason' in error.data) {
          throw new Error((error.data as { reason: string }).reason);
        }
      }
      throw new Error('Ошибка регистрации');
    }
  }
}

export const registerModel = new RegisterModel();

