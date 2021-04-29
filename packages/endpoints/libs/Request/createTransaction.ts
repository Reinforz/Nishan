import { INotionEndpoints, IOperation } from '@nishans/types';
import { v4 } from 'uuid';

/**
 * Create a transaction object suitable to be sent to the saveTransaction endpoint
 * @param spaceId The id of the workspace
 * @param operations The operations array to be added to the transaction
 */
export function createTransaction(spaceId: string, operations: IOperation[]) {
  return {
    requestId: v4(),
    transactions: [
      {
        id: v4(),
        spaceId,
        operations
      }
    ]
  } as INotionEndpoints['saveTransactions']['payload'];
}
