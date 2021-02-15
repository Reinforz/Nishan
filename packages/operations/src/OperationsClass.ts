import { Mutations, createTransaction } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';

export class OperationsClass {
	stack: IOperation[] = [];
	space_id: string;
	shard_id: number;
	token: string;

	constructor (args: { token: string; space_id: string; shard_id: number; stack: IOperation[] }) {
		this.space_id = args.space_id;
		this.shard_id = args.shard_id;
		this.stack = args.stack || [];
		this.token = args.token;
	}

	emptyStack () {
		while (this.stack.length !== 0) this.stack.pop();
	}

	printStack () {
		console.log(JSON.stringify(this.stack, null, 2));
	}

	async executeOperation () {
		if (this.stack.length === 0) console.log(`The operation stack is empty`);
		else {
			await Mutations.saveTransactions(createTransaction(this.shard_id, this.space_id, this.stack), {
				token: this.token,
				interval: 0
			});
			this.emptyStack();
		}
	}
}
