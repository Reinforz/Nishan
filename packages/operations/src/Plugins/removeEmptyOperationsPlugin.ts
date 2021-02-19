import { IOperation } from '@nishans/types';
import { NotionOperationPluginFactory } from '../';
import { PluginOptions } from './Options';

/**
 * Removes empty operations based on the args
 * @param options Options for the plugin
 */
export const removeEmptyOperationsPlugin: NotionOperationPluginFactory = (options) => {
	return (operation: IOperation) => {
		// Checks to see if the operation is to be skipped, ie not further process by the plugin
		PluginOptions.skip(operation, options?.skip);
		const { args } = operation;
		// Remove the operation if arg is either undefined or null
		if (args === undefined || args === null) return false;
		else if (Object.keys(args).length === 0)
			// Remove the operation if arg is an empty object
			return false;
		else
			// Return the operation if all checks passes
			return operation;
	};
};
