import { IOperation, SaveTransactionParams } from '@nishans/types';

import { v4 as uuidv4 } from 'uuid';

export function createTransaction (shardId: number, spaceId: string, operations: IOperation[]) {
	return {
		requestId: uuidv4(),
		transactions: [
			{
				id: uuidv4(),
				shardId,
				spaceId,
				operations
			}
		]
	} as SaveTransactionParams;
}
