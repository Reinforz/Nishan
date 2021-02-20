import { IPermission } from '@nishans/types';

export function populatePermissions (user_id: string, is_private?: boolean): IPermission {
	return { type: is_private ? 'user_permission' : 'space_permission', role: 'editor', user_id: user_id };
}
