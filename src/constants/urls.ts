export const API_BASE_URL = '/api';
export const USERS_API_URL = `${API_BASE_URL}/users`;
export const USER_API_URL_PATTERN = `${USERS_API_URL}/:id`;
export const getUserApiUrl = (id: string | number) => `${USERS_API_URL}/${id}`;
