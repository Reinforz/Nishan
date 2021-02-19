import { IOperation } from '@nishans/types';
import { NotionOperationPluginFactory, OPERATION_COMMANDS, OPERATION_TABLES } from '../';
import { NotionOperationsPluginOptions } from './Options';

/**
 * Validates the passed operation
 * @param options Options for the plugin
 */
export const validateOperationsPlugin: NotionOperationPluginFactory = (options) => {
	return (operation: IOperation) => {
		// Checks to see if the operation is to be skipped, ie not further process by the plugin
		NotionOperationsPluginOptions.skip(operation, options?.skip);
		// Checks if the operation table is one of the supported values
		const is_correct_table = OPERATION_TABLES.includes(operation.table);
		// Throws an error if the passed operation table is not of the supported value
		if (!is_correct_table) throw new Error(`Unsupported operation table ${operation.table}`);
		// Checks if the operation command is one of the supported values
		const is_correct_command = OPERATION_COMMANDS.includes(operation.command);
		// Throws an error if the passed operation command is not of the supported value
		if (!is_correct_command) throw new Error(`Unsupported operation command ${operation.command}`);
		// Return the operation if all checks passes
		return operation;
	};
};
