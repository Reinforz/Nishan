import { IOperation } from '@nishans/types';
import { NotionOperationPluginFactory, OPERATION_COMMANDS, OPERATION_TABLES } from '../';

export const validateOperationsPlugin: NotionOperationPluginFactory = () => {
	return (operation: IOperation) => {
		const is_correct_table = OPERATION_TABLES.includes(operation.table);
		if (!is_correct_table) throw new Error(`Unsupported operation table ${operation.table}`);
		const is_correct_command = OPERATION_COMMANDS.includes(operation.command);
		if (!is_correct_command) throw new Error(`Unsupported operation command ${operation.command}`);
		return operation;
	};
};
