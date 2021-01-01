import { ICollection, NishanArg, TSchemaUnit } from "../types";
import { shortid } from "../utils";
import Data from "./Data";

/**
 * A class to represent a column schema of a collection
 * @noInheritDoc
 */

export default class SchemaUnit<T extends TSchemaUnit> extends Data<ICollection> {
  schema_id: string;

  constructor(arg: NishanArg & { schema_id: string }) {
    super({ ...arg, type: "collection" });
    this.schema_id = arg.schema_id
  }

  async update(arg: T, execute?: boolean) {
    const data = super.getCachedData();
    data.schema[this.schema_id] = { ...data.schema[this.schema_id], ...arg };
    await this.executeUtil([this.updateOp([], { schema: data.schema })], this.id, execute)
    this.logger && this.logger("UPDATE", "SchemaUnit", this.id);
  }

  async delete(execute?: boolean) {
    const data = super.getCachedData();
    delete data.schema[this.schema_id];
    await this.executeUtil([this.updateOp([], { schema: data.schema })], this.id, execute);
    this.logger && this.logger("DELETE", "SchemaUnit", this.id);
  }

  async duplicate(execute?: boolean) {
    const data = super.getCachedData(),
      id = shortid();
    data.schema[id] = data.schema[this.schema_id];;
    await this.executeUtil([this.updateOp([], { schema: data.schema })], this.id, execute)
    this.logger && this.logger("CREATE", "SchemaUnit", id);
  }

  getCachedChildData() {
    const data = super.getCachedData();
    return data.schema[this.schema_id];
  }
}