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

export interface Transaction {
	id: string;
	shardId?: number;
	spaceId: string;
	operations: IOperation[];
}

export interface IOperation {
	pointer: {
		table: TDataType;
		id: string;
	};
	command: TOperationCommand;
	path: string[];
	args: any;
}
