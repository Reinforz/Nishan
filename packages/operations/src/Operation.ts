import { Args, IOperation, TOperationCommand, TDataType } from '@nishans/types';

const tables = [
	'space',
	'space_view',
	'collection',
	'block',
	'collection_view',
	'notion_user',
	'user_settings',
	'user_root'
] as TDataType[];

const commands = [
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

tables.forEach((table) => {
	Operation[table] = {} as any;
	commands.forEach((command) => {
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
