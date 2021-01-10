import { IOperation } from '@nishans/types';
import { NishanArg } from '../types';
import { warn } from '../utils';

import Mutations from './Mutations';

export default class Operations extends Mutations {
	stack: IOperation[] = [];

	constructor (args: NishanArg) {
		super(args);
		this.stack = args.stack || [];
	}

	printStack () {
		console.log(JSON.stringify(this.stack, null, 2));
	}

	async executeOperation () {
		if (this.stack.length === 0) warn(`The operation stack is empty`);
		else {
			await this.saveTransactions(this.stack);
			this.stack = [];
		}
	}
}
