import { createTransaction, Mutations } from '@nishans/endpoints';
import { IOperation, SaveTransactionParams } from '@nishans/types';
import { NotionOperationPlugin } from './types';

export class NotionOperationsClass {
	stack: IOperation[] = [];
	space_id: string;
	shard_id: number;
	token: string;
  #plugins: NotionOperationPlugin[];

	constructor (args: { token: string; space_id: string; shard_id: number; stack: IOperation[], plugins?: NotionOperationPlugin[] }) {
		this.space_id = args.space_id;
		this.shard_id = args.shard_id;
		this.stack = args.stack;
		this.token = args.token;
    this.#plugins = args.plugins ?? []; 
	}

	emptyStack () {
		while (this.stack.length !== 0) this.stack.pop();
	}

	printStack () {
		console.log(JSON.stringify(this.stack, null, 2));
	}

  applyPluginsToOperationsStack(created_transaction: SaveTransactionParams){
    const {operations} = created_transaction.transactions[0];
    const updated_operations: IOperation[] = [];
    for (let index = 0; index < operations.length; index++) {
      const operation = operations[index];
      let updated_operation: false | IOperation = false;
      for (let index = 0; index < this.#plugins.length; index++) {
        const plugin = this.#plugins[index];
        updated_operation = plugin(operation)
      }
      if(updated_operation !== false)
        updated_operations.push(updated_operation)
    }
    return updated_operations;
  }

	async executeOperation () {
		if (this.stack.length === 0) console.log(`The operation stack is empty`);
		else {
      const created_transaction = createTransaction(this.shard_id, this.space_id, this.stack);
      created_transaction.transactions[0].operations = this.applyPluginsToOperationsStack(created_transaction);
			await Mutations.saveTransactions(created_transaction, {
				token: this.token,
				interval: 0
			});
			this.emptyStack();
		}
	}
}
