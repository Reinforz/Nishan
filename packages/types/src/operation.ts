import { TDataType } from './types';

export type TOperationCommand =
	| 'set'
	| 'update'
	| 'keyedObjectListAfter'
	| 'keyedObjectListUpdate'
	| 'listAfter'
	| 'listRemove'
	| 'listBefore'
	| 'setPermissionItem';
export type TOperationTable =
	| 'space'
	| 'collection_view'
	| 'collection'
	| 'collection_view_page'
	| 'page'
	| 'block'
	| 'space_view'
	| 'notion_user'
	| 'user_settings'
	| 'user_root';

export interface Transaction {
	id: string;
	shardId?: number;
	spaceId: string;
	operations: IOperation[];
}

export interface IOperation {
	table: TDataType;
	id: string;
	command: TOperationCommand;
	path: string[];
	args: any;
}
