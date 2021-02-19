import { Args, IOperation, TDataType, TOperationCommand } from '@nishans/types';

export const OPERATION_TABLES = [
	'space',
	'space_view',
	'collection',
	'block',
	'collection_view',
	'notion_user',
	'user_settings',
	'user_root'
] as TDataType[];

export const OPERATION_COMMANDS = [
	'setPermissionItem',
	'listRemove',
	'listBefore',
	'listAfter',
	'update',
	'set'
] as TOperationCommand[];

export const Operation: Record<
	TDataType,
	Record<TOperationCommand, ((id: string, path: string[], args: Args) => IOperation)>
> = {} as any;

OPERATION_TABLES.forEach((table) => {
	Operation[table] = {} as any;
	OPERATION_COMMANDS.forEach((command) => {
		Operation[table][command] = (id: string, path: string[], args: Args): IOperation => {
			return {
				path,
				table,
				command,
				args,
				id
			};
		};
	});
});
