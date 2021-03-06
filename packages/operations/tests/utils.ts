import { IOperation } from '@nishans/types';

export const operation: IOperation = {
	args: {},
	command: 'update',
	pointer: {
		table: 'block',
		id: '123'
	},
	path: []
};

export const common_execute_operations_options = {
	notion_operation_plugins: [],
	token: 'token',
	shard_id: 123,
	space_id: 'space_1'
};
