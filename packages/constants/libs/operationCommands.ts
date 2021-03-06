import { TOperationCommand } from '@nishans/types';

export const createOperationCommands = () =>
	[ 'setPermissionItem', 'listRemove', 'listBefore', 'listAfter', 'update', 'set' ] as TOperationCommand[];
