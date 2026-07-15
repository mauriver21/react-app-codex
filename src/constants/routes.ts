export const USERS_PATH = 'users';
export const USER_CREATE_PATH = `${USERS_PATH}/create`;
export const USER_EDIT_PATH = `${USERS_PATH}/:id`;

export const USERS_ROUTE = `/${USERS_PATH}`;
export const USER_CREATE_ROUTE = `/${USER_CREATE_PATH}`;
export const getUserEditRoute = (id: string | number) => `${USERS_ROUTE}/${id}`;
