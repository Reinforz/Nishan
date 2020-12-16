import { IOperation, NishanArg, UpdateCacheManuallyParam } from "../types";

import Mutations from "./Mutations";

export default class Operations extends Mutations {
  #stack: IOperation[] = [];
  #sync_records: UpdateCacheManuallyParam = []

  constructor(args: NishanArg) {
    super(args);
    this.#stack = []
  }

  pushOperations(operations: IOperation[]) {
    this.#stack.push(...operations)
  }

  pushSyncRecords(sync_records: UpdateCacheManuallyParam) {
    this.#sync_records.push(...sync_records)
  }

  pushOperationSyncRecords(operations: IOperation[], sync_records: UpdateCacheManuallyParam) {
    if (sync_records.length !== 0)
      this.pushSyncRecords(sync_records)
    if (operations.length !== 0)
      this.pushOperations(operations)
  }

  async executeOperation() {
    await this.saveTransactions(this.#stack);
    await this.updateCacheManually(this.#sync_records)
    this.#stack = [];
    this.#sync_records = [];
  }

  showOperationStack() {
    return this.#stack
  }

  showSyncRecordsStack() {
    return this.#sync_records
  }

  protected async executeUtil(ops: IOperation[], sync_records: UpdateCacheManuallyParam, execute?: boolean) {
    execute = execute ?? this.defaultExecutionState;
    if (execute) {
      if (ops.length !== 0)
        await this.saveTransactions(ops);
      if (sync_records.length !== 0)
        await this.updateCacheManually(sync_records);
    } else
      this.pushOperationSyncRecords(ops, sync_records);
  }
}
