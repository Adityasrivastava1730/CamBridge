import api from './api';

export interface AuthResponse {
  token: string;
  user: { id: string; username: string; email: string };
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    username,
    email,
    password,
  });
  return data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data.user;
}
