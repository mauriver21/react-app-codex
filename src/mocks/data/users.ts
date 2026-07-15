import type { User } from '@/interfaces/User';

const seedUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    roleId: 'admin',
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'usr-2',
    name: 'Grace Hopper',
    email: 'grace@example.com',
    roleId: 'editor',
    status: 'active',
    createdAt: '2026-02-15T12:00:00.000Z',
    updatedAt: '2026-02-15T12:00:00.000Z',
  },
  {
    id: 'usr-3',
    name: 'Alan Turing',
    email: 'alan@example.com',
    roleId: 'viewer',
    status: 'inactive',
    createdAt: '2026-03-20T08:30:00.000Z',
    updatedAt: '2026-03-20T08:30:00.000Z',
  },
];

let users = structuredClone(seedUsers);

export const getMockUsers = () => users;
export const setMockUsers = (nextUsers: User[]) => {
  users = nextUsers;
};
export const resetMockUsers = () => {
  users = structuredClone(seedUsers);
};
