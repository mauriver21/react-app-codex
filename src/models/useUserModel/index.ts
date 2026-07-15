import { EntityActionType, useModel, type CrudQueryHandlers } from 'react-redux-use-model';
import { useUserApiClient } from '@/api-clients/useUserApiClient';
import { USER_ENTITY_NAME } from '@/constants/enums';
import type { User } from '@/interfaces/User';

export const useUserModel = () => {
  const api = useUserApiClient();
  const handlers = {
    list: { apiFn: api.list, action: EntityActionType.LIST },
    read: { apiFn: api.read, action: EntityActionType.READ },
    create: { apiFn: api.create, action: EntityActionType.CREATE },
    update: { apiFn: api.update, action: EntityActionType.UPDATE },
    remove: { apiFn: api.remove, action: EntityActionType.REMOVE },
  } satisfies CrudQueryHandlers<User>;

  return useModel<User, typeof handlers>({
    entityName: USER_ENTITY_NAME,
    handlers,
    config: { initialLoadingSize: 8 },
  });
};
