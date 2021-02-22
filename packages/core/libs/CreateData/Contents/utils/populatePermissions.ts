import { IPermission } from '@nishans/types';

/**
 * Creates and returns a permission object that is either user or space available
 * @param user_id Id of the user attached with the permission
 * @param is_private Indicates whether the page is available to all space members or only a single user
 * @returns A permission object based on the passed parameter
 */
export function populatePermissions (user_id: string, is_private?: boolean): IPermission {
	return { type: is_private ? 'user_permission' : 'space_permission', role: 'editor', user_id: user_id };
}
