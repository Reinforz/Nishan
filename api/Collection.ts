import { error } from '../utils';

import Data from "./Data";
import SchemaUnit from "./SchemaUnit";

import { ICollection, IPageInput, UpdatableCollectionParam, NishanArg, IPage, FilterTypes, TSchemaUnit, FilterType, TSchemaUnitType, MSchemaUnit, UpdateTypes, UpdateType, } from "../types";
import Page from './Page';

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection> {
  constructor(args: NishanArg) {
    super({ ...args, type: "collection" });
  }

  #createClass = (type: TSchemaUnitType, schema_id: string) => {
    const args = ({ ...this.getProps(), id: this.id, schema_id })
    return new SchemaUnit<MSchemaUnit[typeof type]>(args)
  }

  /**
   * Update the collection
   * @param opt `CollectionUpdateParam`
   */
  async update(opt: UpdatableCollectionParam, execute?: boolean) {
    const [op, update] = this.updateCacheLocally(opt, ["description", "name", "icon"])
    await this.executeUtil([
      op
    ], [], execute);
    update();
  }

  /**
   * Create multiple templates for the collection
   * @param opts Array of Objects for configuring template options
   */
  async createTemplates(opts: (Omit<Partial<IPageInput>, "type">)[], execute?: boolean) {
    const [ops, sync_records, block_map] = await this.nestedContentPopulate(opts as any, this.id, "collection");
    await this.executeUtil(ops, sync_records, execute);
    return block_map;
  }

  /**
   * Get a single template page of the collection
   * @param args string id or a predicate function
   * @returns Template page object
   */
  async getTemplate(args?: FilterType<IPage>) {
    return (await this.getTemplates(typeof args === "string" ? [args] : args, false))[0]
  }

  /**
   * Get multiple template pages of the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   * @returns An array of template pages object
   */
  async getTemplates(args?: FilterTypes<IPage>, multiple?: boolean): Promise<Page[]> {
    multiple = multiple ?? true;
    const _this = this;
    return this.getItems<IPage>(args, multiple, async function (page) {
      return new Page({
        ..._this.getProps(),
        id: page.id
      })
    })
  }

  async updateTemplate(args: UpdateType<IPage, Omit<IPageInput, "type">>, execute?: boolean) {
    return (await this.updateTemplates(typeof args === "function" ? args : [args], execute, false))[0]
  }

  async updateTemplates(args: UpdateTypes<IPage, Omit<IPageInput, "type">>, execute?: boolean, multiple?: boolean) {
    const data = this.getCachedData();
    const block_ids = await this.updateItems<IPage, Omit<IPageInput, "type">>(args, data?.template_pages ?? [], "Page", execute, multiple);
    return block_ids.map(block_id => new Page({ ...this.getProps(), id: block_id }));
  }

  /**
   * Delete a single template page from the collection
   * @param args string id or a predicate function
   */
  async deleteTemplate(args?: FilterType<IPage>) {
    return await this.deleteTemplates(typeof args === "string" ? [args] : args, false);
  }

  /**
   * Delete multiple template pages from the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async deleteTemplates(args?: FilterTypes<IPage>, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.deleteItems<IPage>(args, multiple)
  }

  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async createPages(rows: Omit<IPageInput, "type">[], execute?: boolean) {
    const [ops, sync_records, block_map] = await this.nestedContentPopulate(rows as any, this.id, "collection")
    await this.executeUtil(ops, sync_records, execute);
    return block_map
  }

  async getPage(arg?: FilterType<IPage>) {
    return (await this.getPages(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getPages(args?: FilterTypes<IPage>, multiple?: boolean) {
    await this.initializeCache();
    const page_ids: string[] = [];
    for (let [_, page] of this.cache.block)
      if (page?.type === "page" && page.parent_id === this.id && !page.is_template) page_ids.push(page.id);

    return (await this.getCustomItems<IPage>(page_ids, "Page", args, multiple)).map((page) => new Page({ ...this.getProps(), id: page.id }));
  }

  async updatePage(args: UpdateType<IPage, Omit<IPageInput, "type">>, execute?: boolean) {
    return (await this.updatePages(typeof args === "function" ? args : [args], execute, false))[0]
  }

  async updatePages(args: UpdateTypes<IPage, Omit<IPageInput, "type">>, execute?: boolean, multiple?: boolean) {
    await this.initializeCache();
    const page_ids: string[] = [];
    for (let [_, page] of this.cache.block)
      if (page?.type === "page" && page.parent_id === this.id && !page.is_template) page_ids.push(page.id);

    const block_ids = await this.updateItems<IPage, Omit<IPageInput, "type">>(args, page_ids, "Page", execute, multiple);
    return block_ids.map(block_id => new Page({ ...this.getProps(), id: block_id }));
  }

  /**
   * Create a new column in the collection schema
   * @param args Schema creation properties
   * @returns A SchemaUnit object representing the column
   */
  async createSchemaUnit(args: TSchemaUnit) {
    return (await this.createSchemaUnits([args]))[0]
  }

  /**
   * Create multiple new columns in the collection schema
   * @param args array of Schema creation properties
   * @returns An array of SchemaUnit objects representing the columns
   */
  async createSchemaUnits(args: TSchemaUnit[]) {
    const results: SchemaUnit<TSchemaUnit>[] = [], data = this.getCachedData();
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      const schema_id = arg.name.toLowerCase().replace(/\s/g, '_');
      data.schema[schema_id] = arg;
      results.push(new SchemaUnit({ schema_id, ...this.getProps(), id: this.id }))
    }
    this.saveTransactions([this.updateOp([], { schema: data.schema })])
    this.updateCacheManually([this.id]);
    return results;
  }

  /**
   * Return multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async getSchemaUnits(args?: FilterTypes<(TSchemaUnit & { key: string })>, multiple?: boolean) {
    multiple = multiple ?? true;
    const schema_unit_map = this.createSchemaUnitMap(), data = this.getCachedData(), container: string[] = Object.keys(data.schema) ?? [];

    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const schema_id = args[index], schema = data.schema[schema_id],
          should_add = container.includes(schema_id);
        if (should_add) {
          schema_unit_map[schema.type].push(this.#createClass(schema.type, schema_id))
          this.logger && this.logger("READ", "SchemaUnit", schema_id)
        }
      }
    } else if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < container.length; index++) {
        const schema_id = container[index], schema = data.schema[container[index]], should_add = (typeof args === "function" ? await args({ ...schema, key: container[index] }, index) : true);
        if (should_add) {
          schema_unit_map[schema.type].push(this.#createClass(schema.type, schema_id))
          this.logger && this.logger("READ", "SchemaUnit", schema_id)
        }
      }
    }
    return schema_unit_map;
  }

  /**
   * Update and return a single column from the collection schema
   * @param args schema_id string and schema properties tuple
   * @returns A SchemaUnit object representing the column
   */
  async updateSchemaUnit(args: [string, TSchemaUnit]) {
    return (await this.updateSchemaUnits([args]))[0]
  }

  /**
   * Update and return multiple columns from the collection schema
   * @param args schema_id string and schema properties array of tuples
   * @returns An array of SchemaUnit objects representing the columns
   */
  async updateSchemaUnits(args: [string, TSchemaUnit][]) {
    const results: SchemaUnit<TSchemaUnit>[] = [], data = this.getCachedData();
    for (let index = 0; index < args.length; index++) {
      const [schema_id, schema_data] = args[index];
      if (!data.schema[schema_id]) error(`Collection:${this.id} does not contain SchemaUnit:${schema_id}`)
      data.schema[schema_id] = { ...data.schema[schema_id], ...schema_data };
      results.push(new SchemaUnit({ schema_id, ...this.getProps(), id: this.id }))
    }
    this.saveTransactions([this.updateOp([], { schema: data.schema })])
    this.updateCacheManually([this.id]);
    return results;
  }

  /**
   * Delete a single column from the collection schema
   * @param args schema_id string or predicate function
   * @returns A SchemaUnit object representing the column
   */
  async deleteSchemaUnit(args?: FilterType<TSchemaUnit & { key: string }>) {
    return (await this.deleteSchemaUnits(typeof args === "string" ? [args] : args, false));
  }

  /**
   * Delete multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async deleteSchemaUnits(args?: FilterTypes<TSchemaUnit & { key: string }>, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), container: string[] = Object.keys(data.schema) ?? [];
    const matched: string[] = []
    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const schema_id = args[index];
        const should_add = container.includes(schema_id);
        if (should_add) matched.push(schema_id)
        if (!multiple && matched.length === 1) break;
      }
    } else if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < container.length; index++) {
        const should_add = typeof args === "function" ? await args({ ...data.schema[container[index]], key: container[index] }, index) : true;
        if (should_add)
          matched.push(container[index])
        if (!multiple && matched.length === 1) break;
      }
    }

    matched.forEach(id => delete data.schema[id]);
    this.saveTransactions([this.updateOp([], { schema: data.schema })]);
    this.updateCacheManually([this.id]);
  }
}

export default Collection;