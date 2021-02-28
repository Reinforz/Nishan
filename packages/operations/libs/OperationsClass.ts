import { NotionMutations, NotionRequest } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { NotionOperationPluginFunction } from './types';

export class NotionOperationsClass {
  #plugins: NotionOperationPluginFunction[];
	space_id: string;
	shard_id: number;
	token: string;
	user_id: string;

	constructor (args: { user_id: string, token: string; space_id: string; shard_id: number; notion_operation_plugins?: NotionOperationPluginFunction[] }) {
		this.space_id = args.space_id;
		this.shard_id = args.shard_id;
		this.token = args.token;
    this.#plugins = args.notion_operation_plugins ?? [];
    this.user_id = args.user_id;
	}

  getPlugins(){
    return this.#plugins;
  }

  /**
   * Applies all the plugins in the class to all the operations in the stack
   */
  applyPluginsToOperationsStack(operations: IOperation[]){
    // Skip the plugin processing process if its empty
    if(this.#plugins.length !== 0 ){
      // This array stores the operations that will be stored in the operations stack after plugin processing
      const updated_operations: IOperation[] = [];
      // Iterate through all the operations and run it through each of the plugins
      for (let index = 0; index < operations.length; index++) {
        const operation = operations[index];
        let updated_operation: false | IOperation = operation;
        // Iterating through each of the plugin to process the operation
        for (let index = 0; index < this.#plugins.length; index++) {
          const plugin = this.#plugins[index];
            updated_operation = plugin(updated_operation);
          // If the plugin returns a false value break the plugin processing loop
          if(updated_operation === false)
            break;
        }
        // If the process operation is not false, push it to the stack
        if(updated_operation !== false)
          updated_operations.push(updated_operation)
      }
      return updated_operations;
    }else
      return operations;
  }

  /**
   * Execute the operations present in the operations stack
   */
	async executeOperation (operations: IOperation[]) {
    // If the stack is empty print a msg to the console
		if (operations.length === 0) console.log(`The operation stack is empty`);
		else {
      // Create a transaction using the space_id, shard_id and the list of operations
      const created_transaction = NotionRequest.createTransaction(this.shard_id, this.space_id, operations);
      // get the operations list after processing it with the list of plugins 
      created_transaction.transactions[0].operations = this.applyPluginsToOperationsStack(operations);
      // Execute the operations, by sending a request to notion's server
			await NotionMutations.saveTransactions(created_transaction, {
				token: this.token,
				interval: 0,
        user_id: this.user_id
			});
		}
	}
}
