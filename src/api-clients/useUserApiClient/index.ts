import { useMemo } from 'react';
import type { ListResponse, PaginationParams } from 'react-redux-use-model';
import type { User } from '@/interfaces/User';

type DataResponse = { data: User };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

export function useUserApiClient() {
  return useMemo(
    () => ({
      list: ({ _page, _size, _filter }: PaginationParams) => {
        const params = new URLSearchParams({ page: String(_page), size: String(_size) });
        if (_filter) params.set('filter', _filter);
        return request<ListResponse<User>>(`/api/users?${params}`);
      },
      read: (id: string | number) => request<DataResponse>(`/api/users/${id}`),
      create: (user: User) =>
        request<DataResponse>('/api/users', { method: 'POST', body: JSON.stringify(user) }),
      update: (id: string | number, user: User) =>
        request<DataResponse>(`/api/users/${id}`, {
          method: 'PUT',
          body: JSON.stringify(user),
        }),
      remove: (id: string | number) =>
        request<DataResponse>(`/api/users/${id}`, { method: 'DELETE' }),
    }),
    [],
  );
}
