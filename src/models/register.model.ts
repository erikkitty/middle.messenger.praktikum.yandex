import type { IRegisterRequest, IUser } from "../types/domains";
import { signUp } from "../api/auth.api";
import { authModel } from "./auth.model";
import { ApiError } from "../utils/http";

export class RegisterModel {
  public async register(data: IRegisterRequest): Promise<IUser> {
    return this.registerWithRecovery(data, true);
  }

  private async registerWithRecovery(
    data: IRegisterRequest,
    canRetryAfterLogout: boolean,
  ): Promise<IUser> {
    try {
      await signUp(data);
      const user = await authModel.getCurrentUser();
      if (!user) {
        throw new Error("Не удалось получить данные пользователя после регистрации");
      }
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          throw new Error('Пользователь с таким логином уже существует', { cause: error });
        }
        if (error.status === 400 && error.data && typeof error.data === 'object' && 'reason' in error.data) {
          const reason = String((error.data as { reason: string }).reason);
          if (reason === "User already in system") {
            if (canRetryAfterLogout) {
              await authModel.logout();
              return this.registerWithRecovery(data, false);
            }
            throw new Error("Пользователь уже авторизован", { cause: error });
          }
          throw new Error(reason, { cause: error });
        }
      }
      throw new Error('Ошибка регистрации', { cause: error });
    }
  }
}

export const registerModel = new RegisterModel();

