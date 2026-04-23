import { HttpClient } from '../utils/http';
import {
  type ILoginRequest,
  type IRegisterRequest,
  type IUser,
  normalizeUser,
} from '../types/domains';

const API_URL = 'https://ya-praktikum.tech/api/v2/';

const http = new HttpClient(API_URL);

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
  return http.post<ISignUpResponse>('auth/signup', data);
}

export async function signIn(data: ILoginRequest): Promise<IUser> {
  const raw = await http.post<ISignInResponseBody | null>('auth/signin', data);
  if (raw?.user) {
    return normalizeUser(raw.user);
  }
  return normalizeUser(await getUser());
}

export async function signOut(): Promise<void> {
  return http.post<void>('auth/logout');
}

export async function getUser(): Promise<IUser> {
  const user = await http.get<IUser & { id?: string | number }>('auth/user');
  return normalizeUser(user);
}
