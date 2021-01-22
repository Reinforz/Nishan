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

const Operations: Record<
	TDataType,
	Record<TOperationCommand, ((id: string, path: string[], args: Args) => IOperation)>
> = {} as any;

tables.forEach((table) => {
	Operations[table] = {} as any;
	commands.forEach((command) => {
		Operations[table][command] = (id: string, path: string[], args: Args): IOperation => {
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

export default Operations;
