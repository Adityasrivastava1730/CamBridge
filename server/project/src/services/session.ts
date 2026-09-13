import api from './api';

export async function createSession(): Promise<{ code: string; sessionId: string }> {
  const { data } = await api.post('/sessions/create');
  return data;
}

export async function getSessionStatus(code: string): Promise<{ status: string; host: string }> {
  const { data } = await api.get(`/sessions/status/${code}`);
  return data;
}
