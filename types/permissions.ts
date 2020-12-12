export type TPermissionType = 'user_permission' | 'space_permission' | 'public_permission';

export type TPublicPermissionRole = 'read_and_write' | 'comment_only' | 'reader' | 'none'
export type TUserPermissionRole = 'editor' | TPublicPermissionRole;
export type TSpacePermissionRole = 'editor' | TPublicPermissionRole;

export type TPermissionRole =
  TPublicPermissionRole |
  TUserPermissionRole |
  TSpacePermissionRole;

export type IPermission = IUserPermission | IPublicPermission | ISpacePermission;

export interface IUserPermission {
  role: TUserPermissionRole,
  type: 'user_permission',
  user_id: string,
}

export interface IPublicPermission {
  type: 'public_permisison',
  role: TPublicPermissionRole,
  allow_duplicates: boolean
}

export interface ISpacePermission {
  role: TSpacePermissionRole,
  type: 'space_permission',
  user_id: string,
}