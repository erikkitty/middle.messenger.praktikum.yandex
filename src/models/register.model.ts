import type { IRegisterRequest, IUser } from "../types/domains";

const LS_USER_KEY = "app.user";
const LS_PASSWORD_KEY = "app.password";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function saveUser(user: IUser): void {
  localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
}

function savePassword(password: string): void {
  localStorage.setItem(LS_PASSWORD_KEY, password);
}

export class RegisterModel {
  public async register(data: IRegisterRequest): Promise<IUser> {
    await delay(200);

    if (localStorage.getItem(LS_USER_KEY)) {
      throw new Error("Пользователь уже зарегистрирован");
    }

    const user: IUser = {
      id: String(Date.now()),
      first_name: data.first_name,
      second_name: data.second_name,
      display_name: `${data.first_name} ${data.second_name}`,
      login: data.login,
      email: data.email,
      phone: data.phone,
    };

    saveUser(user);
    savePassword(data.password);

    return user;
  }
}

export const registerModel = new RegisterModel();

