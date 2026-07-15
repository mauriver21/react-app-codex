import { delay, http, HttpResponse } from 'msw';
import { USER_API_URL_PATTERN, USERS_API_URL } from '@/constants/urls';
import type { User } from '@/interfaces/User';
import { getMockUsers, setMockUsers } from '@/mocks/data/users';

export const userHandlers = [
  http.get(USERS_API_URL, async ({ request }) => {
    await delay(650);
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
    const size = Math.max(1, Number(url.searchParams.get('size') ?? 20));
    const filter = url.searchParams.get('filter')?.toLowerCase();
    const filtered = filter
      ? getMockUsers().filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(filter))
      : getMockUsers();
    const start = (page - 1) * size;

    return HttpResponse.json({
      data: filtered.slice(start, start + size),
      pagination: {
        page,
        size,
        totalElements: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / size)),
      },
    });
  }),
  http.get(USER_API_URL_PATTERN, ({ params }) => {
    const user = getMockUsers().find(({ id }) => id === params.id);
    return user ? HttpResponse.json({ data: user }) : HttpResponse.json({ message: 'Not found' }, { status: 404 });
  }),
  http.post(USERS_API_URL, async ({ request }) => {
    const input = (await request.json()) as User;
    const now = new Date().toISOString();
    const user: User = {
      ...input,
      id: input.id || crypto.randomUUID(),
      createdAt: input.createdAt || now,
      updatedAt: now,
    };
    setMockUsers([...getMockUsers(), user]);
    return HttpResponse.json({ data: user }, { status: 201 });
  }),
  http.put(USER_API_URL_PATTERN, async ({ params, request }) => {
    const input = (await request.json()) as User;
    const current = getMockUsers().find(({ id }) => id === params.id);
    if (!current) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const user: User = { ...current, ...input, id: current.id, updatedAt: new Date().toISOString() };
    setMockUsers(getMockUsers().map((item) => (item.id === current.id ? user : item)));
    return HttpResponse.json({ data: user });
  }),
  http.delete(USER_API_URL_PATTERN, ({ params }) => {
    const user = getMockUsers().find(({ id }) => id === params.id);
    if (!user) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    setMockUsers(getMockUsers().filter(({ id }) => id !== params.id));
    return HttpResponse.json({ data: user });
  }),
];
