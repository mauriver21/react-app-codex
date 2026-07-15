import type { User } from '@/interfaces/User';
import { getUserApiUrl, USERS_API_URL } from '@/constants/urls';

describe('mocked User CRUD flow', () => {
  it('lists, creates, updates, reads, and deletes a user', async () => {
    const listResponse = await fetch(`${USERS_API_URL}?page=1&size=20`);
    const initial = (await listResponse.json()) as { data: User[] };
    expect(initial.data).toHaveLength(3);

    const now = new Date().toISOString();
    const draft: User = {
      id: 'usr-test',
      name: 'Test User',
      email: 'test@example.com',
      roleId: 'viewer',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    const createdResponse = await fetch(USERS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    expect(createdResponse.status).toBe(201);

    const updatedResponse = await fetch(getUserApiUrl('usr-test'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, name: 'Updated User' }),
    });
    const updated = (await updatedResponse.json()) as { data: User };
    expect(updated.data.name).toBe('Updated User');

    const readResponse = await fetch(getUserApiUrl('usr-test'));
    const read = (await readResponse.json()) as { data: User };
    expect(read.data.email).toBe('test@example.com');

    const deletedResponse = await fetch(getUserApiUrl('usr-test'), { method: 'DELETE' });
    expect(deletedResponse.ok).toBe(true);
    expect(await fetch(getUserApiUrl('usr-test'))).toHaveProperty('status', 404);
  });
});
