import { NotionQueries } from '@nishans/endpoints';
import {
  NotionOperationOptions,
  NotionOperationPluginFunction,
  NotionOperationsObject,
  Operation
} from '@nishans/operations';
import {
  IOperation,
  IPermission,
  IPublicPermission,
  IPublicPermissionOptions,
  IUserPermission,
  TBlock,
  TPage,
  TPermissionRole,
  TPublicPermissionRole,
  TSpacePermissionRole,
  TUserPermissionRole
} from '@nishans/types';
import { NotionUtils } from '@nishans/utils';

interface UserIdentifier {
	id?: string;
	email?: string;
}

type NotionPermissionsCtorArg = NotionOperationOptions & { user_id: string, id: string; cache: { block: Map<string, TBlock> } };

export class NotionBlockPermissions {
	id: string;
	token: string;
	user_id: string;
	interval?: number;
	space_id: string;
	shard_id: number;
	notion_operation_plugins: NotionOperationPluginFunction[];
	cache: { block: Map<string, TBlock> };

	constructor (arg: NotionPermissionsCtorArg) {
		this.id = arg.id;
		this.token = arg.token;
		this.user_id = arg.user_id;
		this.interval = arg.interval;
		this.notion_operation_plugins = arg.notion_operation_plugins ?? [];
		this.shard_id = arg.shard_id;
		this.space_id = arg.space_id;
		this.cache = arg.cache;
	}

	getProps () {
		return {
			token: this.token,
			interval: this.interval,
			user_id: this.user_id,
			shard_id: this.shard_id,
			space_id: this.space_id,
			cache: this.cache,
			notion_operation_plugins: this.notion_operation_plugins
		} as NotionPermissionsCtorArg;
	}

	async getNotionUserIdFromEmail ({ email, id }: UserIdentifier) {
		let user_id = id;
		if (email) {
			const { value } = await NotionQueries.findUser(
				{ email },
				{
					user_id: this.user_id,
					interval: this.interval,
					token: this.token
				}
			);
			if (!value) throw new Error(`User does not have a notion account`);
			else user_id = value.value.id;
		}
		return user_id as string;
	}

	updatePermissionsArray (
		permission_type: 'public_permission' | 'space_permission',
		options: { role: TPermissionRole } & Partial<IPublicPermissionOptions>
	): IOperation;
	updatePermissionsArray (
		permission_type: 'user_permission',
		options: { role: TPermissionRole },
		user_id: string
	): IOperation;
	updatePermissionsArray (
		permission_type: IPermission['type'],
		options: { role: TPermissionRole } & Partial<IPublicPermissionOptions>,
		user_id?: string
	): IOperation {
		let permission_data: IPermission = {} as any,
			operation: IOperation = undefined as any;
		if (permission_type === 'public_permission' || permission_type === 'space_permission')
			permission_data = { ...options, type: permission_type } as IPublicPermission;
		else permission_data = { role: options.role, type: permission_type, user_id } as IUserPermission;
		operation = Operation.block.setPermissionItem(this.id, [ 'permissions' ], permission_data);
		const { permissions } = this.cache.block.get(this.id) as TPage;
		const permission_index = permissions.findIndex((permission) => {
			if (permission_type === 'public_permission' || permission_type === 'space_permission')
				return permission.type === permission_type;
			else return permission.type === permission_type && permission.user_id === user_id;
		});
		if (options.role === 'none') permissions.splice(permission_index, 1);
		else if (permissions[permission_index]) NotionUtils.deepMerge(permissions[permission_index], options);
		else permissions.push(permission_data);
		return operation;
	}

	async addUserPermission (id: UserIdentifier, role: TUserPermissionRole) {
		await this.addUserPermissions([ [ id, role ] ]);
	}

	/**
   * Share page to users with specific permissions
   * @param args array of user id and role of user to share pages to
   */
	async addUserPermissions (args: [UserIdentifier, TUserPermissionRole][]) {
		await this.updateUserPermissions(args);
	}

	/**
   * Update the role of the current user based on their id
   * @param id Id of the user to update
   * @param role new Role of the user to update
   */
	async updateUserPermission (id: UserIdentifier, role: TUserPermissionRole) {
		await this.updateUserPermissions([ [ id, role ] ]);
	}

	/**
   * Update the role of the current users based on their id
   * @param args array of array [id of the user, role type for the user]
   */
	async updateUserPermissions (args: [UserIdentifier, TUserPermissionRole][]) {
		const operations: IOperation[] = [];
		for (let index = 0; index < args.length; index++) {
			const [ arg, role ] = args[index];
			const user_id = await this.getNotionUserIdFromEmail(arg);
			operations.push(this.updatePermissionsArray('user_permission', { role }, user_id));
		}
		const data = this.cache.block.get(this.id) as TPage;
		data.last_edited_time = Date.now();
		await NotionOperationsObject.executeOperations(
			[ ...operations, Operation.block.update(this.id, [], { last_edited_time: Date.now() }) ],
			this.getProps()
		);
	}

	/**
   * Remove a single user from the pages permission option
   * @param id Id of the user to remove from permission
   */
	async removeUserPermission (id: UserIdentifier) {
		await this.removeUserPermissions([ id ]);
	}

	/**
   * Remove multiple users from the pages permission option
   * @param id array of the users id to remove from permission
   */
	async removeUserPermissions (ids: UserIdentifier[]) {
		await this.updateUserPermissions(ids.map((id) => [ id, 'none' ]));
	}

	async updateNonUserSpecificPermission (
		permission_type: 'public_permission',
		options: { role: TPublicPermissionRole } & Partial<IPublicPermissionOptions>
	): Promise<void>;
	async updateNonUserSpecificPermission (
		permission_type: 'space_permission',
		options: { role: TSpacePermissionRole }
	): Promise<void>;
	async updateNonUserSpecificPermission (
		permission_type: 'public_permission' | 'space_permission',
		options: { role: TPublicPermissionRole | TSpacePermissionRole } & Partial<IPublicPermissionOptions>
	): Promise<void> {
		const data = this.cache.block.get(this.id) as TPage;
		data.last_edited_time = Date.now();
		await NotionOperationsObject.executeOperations(
			[
				this.updatePermissionsArray(permission_type, options as IPublicPermission),
				Operation.block.update(this.id, [], { last_edited_time: Date.now() })
			],
			this.getProps()
		);
	}

	async addPublicPermission (options: { role: TPublicPermissionRole } & Partial<IPublicPermissionOptions>) {
		await this.updatePublicPermission({
			allow_duplicate: true,
			allow_search_engine_indexing: true,
			...options
		});
	}

	async updatePublicPermission (options: { role: TPublicPermissionRole } & Partial<IPublicPermissionOptions>) {
		await this.updateNonUserSpecificPermission('public_permission', options);
	}

	async removePublicPermission () {
		await this.updatePublicPermission({ role: 'none' });
	}

	async updateSpacePermission (role: TSpacePermissionRole) {
		await this.updateNonUserSpecificPermission('space_permission', { role });
	}

	async removeSpacePermission () {
		await this.updateSpacePermission('none');
	}
}
