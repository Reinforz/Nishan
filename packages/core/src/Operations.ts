import { Mutations, createTransaction } from '@nishans/endpoints';
import { NotionCache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { NishanArg } from '../types';
import { warn } from '../utils';

export default class Operations extends NotionCache {
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
			await Mutations.saveTransactions(createTransaction(this.shard_id, this.space_id, this.stack), {
				token: this.token,
				interval: 0,
				user_id: this.user_id
			});
			this.emptyStack();
		}
	}
}
