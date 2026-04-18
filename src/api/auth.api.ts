import { HttpClient } from '../utils/http';
import type { ILoginRequest, IRegisterRequest, IUser } from '../types/domains';

const API_URL = 'https://ya-praktikum.tech/api/v2';

const http = new HttpClient(API_URL);

export interface ISignUpResponse {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface ISignInResponse {
  user: IUser;
  token: string;
}

export async function signUp(data: IRegisterRequest): Promise<ISignUpResponse> {
  return http.post<ISignUpResponse>('/auth/signup', data);
}

export async function signIn(data: ILoginRequest): Promise<ISignInResponse> {
  return http.post<ISignInResponse>('/auth/signin', data);
}

export async function signOut(): Promise<void> {
  return http.post<void>('/auth/logout');
}

export async function getUser(): Promise<IUser> {
  return http.get<IUser>('/user');
}
