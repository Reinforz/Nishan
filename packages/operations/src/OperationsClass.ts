import { createTransaction, Mutations } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { NotionOperationPluginFunction } from './types';

export class NotionOperationsClass {
	#stack: IOperation[] = [];
  #plugins: NotionOperationPluginFunction[];
	space_id: string;
	shard_id: number;
	token: string;

	constructor (args: { token: string; space_id: string; shard_id: number; stack: IOperation[], plugins?: NotionOperationPluginFunction[] }) {
		this.space_id = args.space_id;
		this.shard_id = args.shard_id;
		this.token = args.token;
		this.#stack = args.stack;
    this.#plugins = args.plugins ?? []; 
	}

  /**
   * Empty the operation stack, useful after all the operations has been executed
   */
	emptyStack () {
		while (this.#stack.length !== 0) this.#stack.pop();
	}

  /**
   * A simple utility method to print the current stack by pretty formatting it in console
   */
	printStack () {
		console.log(JSON.stringify(this.#stack, null, 2));
	}

  /**
   * Applies all the plugins in the class to all the operations in the stack
   */
  applyPluginsToOperationsStack(){
    // Skip the plugin processing process if its empty
    if(this.#plugins.length !== 0 ){
      // This array stores the operations that will be stored in the operations stack after plugin processing
      const updated_operations: IOperation[] = [];
      // Iterate through all the operations and run it through each of the plugins
      for (let index = 0; index < this.#stack.length; index++) {
        const operation = this.#stack[index];
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
      return this.#stack
  }

  /**
   * Pushes a list of operations to the operations stack
   * @param operations A list of operations to push to the end of the operations tack
   */
  pushToStack(operations: IOperation | IOperation[]){
    if(Array.isArray(operations)) this.#stack.push(...operations)
    else this.#stack.push(operations);
  }

  /** Get the private stack property which contains all the operations */
  get stack(){
    return this.#stack;
  }

  /**
   * Execute the operations present in the operations stack
   */
	async executeOperation () {
    // If the stack is empty print a msg to the console
		if (this.#stack.length === 0) console.log(`The operation stack is empty`);
		else {
      // Create a transaction using the space_id, shard_id and the list of operations
      const created_transaction = createTransaction(this.shard_id, this.space_id, this.#stack);
      // get the operations list after processing it with the list of plugins 
      created_transaction.transactions[0].operations = this.applyPluginsToOperationsStack();
      // Execute the operations, by sending a request to notion's server
			await Mutations.saveTransactions(created_transaction, {
				token: this.token,
				interval: 0
			});
      // Empty the operations stack since its been executed
			this.emptyStack();
		}
	}
}
