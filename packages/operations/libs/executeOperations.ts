import { NotionMutations, NotionRequest } from "@nishans/endpoints";
import { IOperation } from "@nishans/types";
import { NotionOperationOptions, NotionOperations } from "./";

export async function executeOperations (operations: IOperation[], options: NotionOperationOptions) {
  // If the stack is empty print a msg to the console
  if (operations.length === 0) console.log(`The operation stack is empty`);
  else {
    // Create a transaction using the space_id, shard_id and the list of operations
    const created_transaction = NotionRequest.createTransaction(options.shard_id, options.space_id, operations);
    // get the operations list after processing it with the list of plugins
    created_transaction.transactions[0].operations = NotionOperations.applyPluginsToOperationsStack(
      operations,
      options.notion_operation_plugins ?? []
    );
    // Execute the operations, by sending a request to notion's server
    await NotionMutations.saveTransactions(created_transaction, options);
    while (operations.length !== 0) operations.pop();
  }
}