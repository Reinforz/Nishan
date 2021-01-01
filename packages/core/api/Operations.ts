import { IOperation, NishanArg, UpdateCacheManuallyParam } from "../../types";
import { warn } from "../utils";

import Mutations from "./Mutations";

export default class Operations extends Mutations {
  stack: IOperation[] = [];
  sync_records: UpdateCacheManuallyParam = []

  constructor(args: NishanArg) {
    super(args);
    this.stack = args.stack || []
    this.sync_records = args.sync_records || []
  }

  protected pushOperations(operations: IOperation[]) {
    this.stack.push(...operations)
  }

  protected pushSyncRecords(sync_records: UpdateCacheManuallyParam) {
    this.sync_records.push(...sync_records)
  }

  protected pushOperationSyncRecords(operations: IOperation[], sync_records: UpdateCacheManuallyParam) {
    if (sync_records.length !== 0)
      this.pushSyncRecords(sync_records)
    if (operations.length !== 0)
      this.pushOperations(operations)
  }

  printStack() {
    console.log(JSON.stringify(this.stack, null, 2))
  }

  async executeOperation() {
    if (this.stack.length === 0)
      warn(`The operation stack is empty`)
    else {
      await this.saveTransactions(this.stack);
      this.stack = [];
    }
    if (this.sync_records.length === 0)
      warn(`The sync_record stack is empty`)
    else {
      await this.updateCacheManually(this.sync_records)
      this.sync_records = [];
    }
  }

  protected async executeUtil(ops: IOperation[], sync_records: UpdateCacheManuallyParam | string, execute?: boolean) {
    execute = execute ?? this.defaultExecutionState;
    if (execute) {
      if (ops.length !== 0)
        await this.saveTransactions(ops);
      if (sync_records.length !== 0)
        await this.updateCacheManually(typeof sync_records === "string" ? [sync_records] : sync_records);
    } else
      this.pushOperationSyncRecords(ops, typeof sync_records === "string" ? [sync_records] : sync_records);
  }
}
