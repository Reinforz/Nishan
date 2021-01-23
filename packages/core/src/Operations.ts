import { saveTransactions, Cache, createTransaction } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { NishanArg } from '../types';
import { warn } from '../utils';

export default class Operations extends Cache {
	stack: IOperation[] = [];
	space_id: string;
	shard_id: number;

	constructor (args: NishanArg) {
		super(args);
		this.space_id = args.space_id;
		this.shard_id = args.shard_id;
		this.stack = args.stack || [];
	}

	emptyStack () {
		while (this.stack.length !== 0) this.stack.pop();
	}

	printStack () {
		console.log(JSON.stringify(this.stack, null, 2));
	}

	async executeOperation () {
		if (this.stack.length === 0) warn(`The operation stack is empty`);
		else {
			await saveTransactions(createTransaction(this.shard_id, this.space_id, this.stack), { token: this.token });
			this.emptyStack();
		}
	}
}
