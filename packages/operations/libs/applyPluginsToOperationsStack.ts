import { IOperation } from '@nishans/types';
import { NotionOperationPluginFunction } from './';

export function applyPluginsToOperationsStack (operations: IOperation[], plugins?: NotionOperationPluginFunction[]) {
	// Skip the plugin processing process if its empty
	if (plugins && plugins.length !== 0) {
		// This array stores the operations that will be stored in the operations stack after plugin processing
		const updated_operations: IOperation[] = [];
		// Iterate through all the operations and run it through each of the plugins
		operations.forEach((operation) => {
			let updated_operation: false | IOperation = operation;
			// Iterating through each of the plugin to process the operation
			for (let index = 0; index < plugins.length; index++) {
				const plugin = plugins[index];
				updated_operation = plugin(updated_operation);
				// If the plugin returns a false value break the plugin processing loop
				if (updated_operation === false) break;
			}
			// If the process operation is not false, push it to the stack
			if (updated_operation !== false) updated_operations.push(updated_operation);
		});
		return updated_operations;
	} else return operations;
}
