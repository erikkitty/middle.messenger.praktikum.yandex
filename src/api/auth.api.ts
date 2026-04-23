import { HttpClient } from '../utils/http';
import {
  type ILoginRequest,
  type IRegisterRequest,
  type IUser,
  normalizeUser,
} from '../types/domains';

const http = new HttpClient("auth");

interface ISignInResponseBody {
  user?: IUser & { id?: string | number };
}

export interface ISignUpResponse {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export async function signUp(data: IRegisterRequest): Promise<ISignUpResponse> {
  return http.post<ISignUpResponse>('signup', data);
}

export async function signIn(data: ILoginRequest): Promise<IUser> {
  const raw = await http.post<ISignInResponseBody | null>('signin', data);
  if (raw?.user) {
    return normalizeUser(raw.user);
  }
  return normalizeUser(await getUser());
}

export async function signOut(): Promise<void> {
  return http.post<void>('logout');
}

export async function getUser(): Promise<IUser> {
  const user = await http.get<IUser & { id?: string | number }>('user');
  return normalizeUser(user);
}
