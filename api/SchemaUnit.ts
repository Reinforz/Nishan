import { ICollection, NishanArg, TSchemaUnit } from "../types";
import { shortid } from "../utils";
import Data from "./Data";

/**
 * A class to represent a column schema of a collection
 * @noInheritDoc
 */

export default class SchemaUnit extends Data<ICollection> {
  schema_id: string;

  constructor(arg: NishanArg & { schema_id: string }) {
    super({ ...arg, type: "collection" });
    this.schema_id = arg.schema_id
  }

  async update(arg: TSchemaUnit) {
    const data = this.getCachedData();
    data.schema[this.schema_id] = { ...data.schema[this.schema_id], ...arg }
    this.saveTransactions([this.updateOp([], { schema: data.schema })])
    this.updateCacheManually([this.id]);
  }

  async delete() {
    const data = this.getCachedData();
    delete data.schema[this.schema_id];
    this.saveTransactions([this.updateOp([], { schema: data.schema })])
    this.updateCacheManually([this.id]);
  }

  async duplicate(schema_id: string) {
    const data = this.getCachedData();
    const id = schema_id ?? shortid()
    data.schema[id] = data.schema[this.schema_id];
    this.saveTransactions([this.updateOp([], { schema: data.schema })])
    this.updateCacheManually([this.id]);
  }
}