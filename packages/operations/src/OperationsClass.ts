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

	emptyStack () {
		while (this.#stack.length !== 0) this.#stack.pop();
	}

	printStack () {
		console.log(JSON.stringify(this.#stack, null, 2));
	}

  applyPluginsToOperationsStack(){
    if(this.#plugins.length !== 0 ){
      const updated_operations: IOperation[] = [];
      for (let index = 0; index < this.#stack.length; index++) {
        const operation = this.#stack[index];
        let updated_operation: false | IOperation = operation;
        for (let index = 0; index < this.#plugins.length; index++) {
          const plugin = this.#plugins[index];
            updated_operation = plugin(updated_operation);
          if(updated_operation === false)
            break;
        }
        if(updated_operation !== false)
          updated_operations.push(updated_operation)
      }
      return updated_operations;
    }else
      return this.#stack
  }

  pushToStack(operations: IOperation | IOperation[]){
    if(Array.isArray(operations)) this.#stack.push(...operations)
    else this.#stack.push(operations);
  }

  get stack(){
    return this.#stack;
  }

	async executeOperation () {
		if (this.#stack.length === 0) console.log(`The operation stack is empty`);
		else {
      const created_transaction = createTransaction(this.shard_id, this.space_id, this.#stack);
      created_transaction.transactions[0].operations = this.applyPluginsToOperationsStack();
			await Mutations.saveTransactions(created_transaction, {
				token: this.token,
				interval: 0
			});
			this.emptyStack();
		}
	}
}
