import { useMemo } from 'react';
import type { ListResponse, PaginationParams } from 'react-redux-use-model';
import { getUserApiUrl, USERS_API_URL } from '@/constants/urls';
import type { User } from '@/interfaces/User';
import type { UserDataResponse } from '@/interfaces/UserDataResponse';

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json() as Promise<T>;
};

export const useUserApiClient = () =>
  useMemo(
    () => ({
      list: ({ _page, _size, _filter }: PaginationParams) => {
        const params = new URLSearchParams({ page: String(_page), size: String(_size) });
        if (_filter) params.set('filter', _filter);
        return request<ListResponse<User>>(`${USERS_API_URL}?${params}`);
      },
      read: (id: string | number) => request<UserDataResponse>(getUserApiUrl(id)),
      create: (user: User) => request<UserDataResponse>(USERS_API_URL, { method: 'POST', body: JSON.stringify(user) }),
      update: (id: string | number, user: User) =>
        request<UserDataResponse>(getUserApiUrl(id), {
          method: 'PUT',
          body: JSON.stringify(user),
        }),
      remove: (id: string | number) => request<UserDataResponse>(getUserApiUrl(id), { method: 'DELETE' }),
    }),
    []
  );
