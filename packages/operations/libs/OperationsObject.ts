import { NotionMutations, NotionRequest, NotionRequestConfigs } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { NotionOperationPluginFunction } from '.';

export const NotionOperationsObject = {
	applyPluginsToOperationsStack (operations: IOperation[], plugins: NotionOperationPluginFunction[]) {
		// Skip the plugin processing process if its empty
		if (plugins.length !== 0) {
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
	},
	async executeOperations (
		operations: IOperation[],
		plugins: NotionOperationPluginFunction[],
		configs: NotionRequestConfigs,
		{ shard_id, space_id }: { shard_id: number; space_id: string }
	) {
		// If the stack is empty print a msg to the console
		if (operations.length === 0) console.log(`The operation stack is empty`);
		else {
			// Create a transaction using the space_id, shard_id and the list of operations
			const created_transaction = NotionRequest.createTransaction(shard_id, space_id, operations);
			// get the operations list after processing it with the list of plugins
			created_transaction.transactions[0].operations = NotionOperationsObject.applyPluginsToOperationsStack(
				operations,
				plugins
			);
			// Execute the operations, by sending a request to notion's server
			await NotionMutations.saveTransactions(created_transaction, configs);
			while (operations.length !== 0) operations.pop();
		}
	}
};
