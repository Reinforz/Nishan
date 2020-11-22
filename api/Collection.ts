import { v4 as uuidv4 } from 'uuid';

import { error, Operation } from '../utils';

import Data from "./Data";
import SchemaUnit from "./SchemaUnit";

import { ICollection, IPageInput, UpdatableCollectionUpdateParam, NishanArg, IOperation, RepositionParams, IPage, FilterTypes, TSchemaUnit, FilterType, } from "../types";
import Page from './Page';

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "collection" });
  }

  /**
   * Update the collection
   * @param opt `CollectionUpdateParam`
   */
  async update(opt: UpdatableCollectionUpdateParam) {
    const [op, update] = this.updateCacheLocally(opt, ["description", "name", "icon"])
    await this.saveTransactions([
      op
    ]);
    update();
  }

  /**
   * Create a template for the collection
   * @param opts Object for configuring template options
   */
  async createTemplate(opt: Omit<Partial<IPageInput>, "type">) {
    return (await this.createTemplates([opt]))[0]
  }

  /**
   * Create multiple templates for the collection
   * @param opts Array of Objects for configuring template options
   */
  async createTemplates(opts: (Omit<Partial<IPageInput>, "type"> & { position?: RepositionParams })[]) {
    const ops: IOperation[] = [], template_ids: string[] = [];

    for (let index = 0; index < opts.length; index++) {
      const opt = opts[index],
        { properties = {}, format = {} } = opt,
        $template_id = uuidv4();
      const block_list_op = this.addToChildArray($template_id, opt.position);
      template_ids.push($template_id);
      ops.push(Operation.block.set($template_id, [], {
        type: 'page',
        id: $template_id,
        version: 1,
        is_template: true,
        parent_id: this.id,
        parent_table: 'collection',
        alive: true,
        properties,
        format
      }), block_list_op);
    }

    await this.saveTransactions(ops);
    await this.updateCacheManually(template_ids);
    return template_ids.map(template_id => new Page({
      ...this.getProps(),
      id: template_id,
    }))
  }

  /**
   * Get a single template page of the collection
   * @param arg string id or a predicate function
   * @returns Template page object
   */
  async getTemplate(arg: FilterType<IPage>) {
    return (await this.getTemplates(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  /**
   * Get multiple template pages of the collection
   * @param arg string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   * @returns An array of template pages object
   */
  async getTemplates(arg: FilterTypes<IPage>, multiple?: boolean): Promise<Page[]> {
    multiple = multiple ?? true;
    const _this = this;
    return this.getItems<IPage>(arg as any, multiple, async function (page) {
      return new Page({
        ..._this.getProps(),
        id: page.id
      }) as any
    })
  }

  async updateTemplate(id: string, opt: Omit<IPageInput, "type">) {
    await this.updateTemplates([[id, opt]]);
  }

  async updateTemplates(arg: [string, Omit<IPageInput, "type">][]) {
    const data = this.getCachedData(), ops: IOperation[] = [], current_time = Date.now(), block_ids: string[] = [];
    for (let index = 0; index < arg.length; index++) {
      const [id, opts] = arg[index];
      block_ids.push(id);
      if (data.template_pages && data.template_pages.includes(id))
        ops.push(Operation.block.update(id, [], { ...opts, last_edited_time: current_time }))
      else
        throw new Error(error(`Collection:${data.id} is not the parent of Template Page:${id}`));
    }
    await this.saveTransactions(ops);
    await this.updateCacheManually(block_ids);
  }

  /**
   * Delete a single template page from the collection
   * @param arg string id or a predicate function
   */
  async deleteTemplate(arg: FilterType<IPage>) {
    return await this.deleteTemplates(typeof arg === "string" ? [arg] : arg, false);
  }

  /**
   * Delete multiple template pages from the collection
   * @param arg string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async deleteTemplates(arg: FilterTypes<IPage>, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.deleteItems<IPage>(arg, multiple)
  }

  // ? TD:2:H Better TS Support rather than using any
  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async addRows(rows: { format: any, properties: any }[]) {
    const page_ids: string[] = [];
    const ops: IOperation[] = [];
    rows.map(({ format, properties }) => {
      const $page_id = uuidv4();
      page_ids.push($page_id);
      ops.push(
        Operation.block.update($page_id, [], {
          alive: true,
          $block_id: $page_id,
          type: "page",
          properties,
          format,
          parent_id: this.id,
          parent_table: 'collection',
        })
      );
    });
    await this.saveTransactions(ops)

    return page_ids.map((page_id) => new Page({
      id: page_id,
      ...this.getProps()
    }))
  }

  /**
   * Create a new column in the collection schema
   * @param arg Schema creation properties
   * @returns A SchemaUnit object representing the column
   */
  async createSchemaUnit(arg: TSchemaUnit) {
    return (await this.createSchemaUnits([arg]))[0]
  }

  /**
   * Create multiple new columns in the collection schema
   * @param arg array of Schema creation properties
   * @returns An array of SchemaUnit objects representing the columns
   */
  async createSchemaUnits(args: TSchemaUnit[]) {
    const results: SchemaUnit[] = [], data = this.getCachedData();
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
   * Return a single column from the collection schema
   * @param arg schema_id string or predicate function
   * @returns A SchemaUnit object representing the column
   */
  async getSchemaUnit(arg: FilterType<TSchemaUnit & { key: string }>) {
    return (await this.getSchemaUnits(typeof arg === "string" ? [arg] : arg, false))[0];
  }

  /**
   * Return multiple columns from the collection schema
   * @param arg schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async getSchemaUnits(arg: FilterTypes<TSchemaUnit & { key: string }>, multiple?: boolean) {
    multiple = multiple ?? true;
    const matched: SchemaUnit[] = [];
    const data = this.getCachedData(), container: string[] = Object.keys(data.schema) as any ?? [];

    if (Array.isArray(arg)) {
      for (let index = 0; index < arg.length; index++) {
        const schema_id = arg[index];
        const should_add = container.includes(schema_id);
        if (should_add)
          matched.push(new SchemaUnit({ ...this.getProps(), id: this.id, schema_id }))
        if (!multiple && matched.length === 1) break;
      }
    } else if (typeof arg === "function" || arg === undefined) {
      for (let index = 0; index < container.length; index++) {
        const should_add = typeof arg === "function" ? await arg({ ...data.schema[container[index]], key: container[index] }, index) : true;
        if (should_add)
          matched.push(new SchemaUnit({ ...this.getProps(), id: this.id, schema_id: container[index] }))
        if (!multiple && matched.length === 1) break;
      }
    }
    return matched;
  }



  /**
   * Update and return a single column from the collection schema
   * @param arg schema_id string and schema properties tuple
   * @returns A SchemaUnit object representing the column
   */
  async updateSchemaUnit(arg: [string, TSchemaUnit]) {
    return (await this.updateSchemaUnits([arg]))[0]
  }

  /**
   * Update and return multiple columns from the collection schema
   * @param arg schema_id string and schema properties array of tuples
   * @returns An array of SchemaUnit objects representing the columns
   */
  async updateSchemaUnits(args: [string, TSchemaUnit][]) {
    const results: SchemaUnit[] = [], data = this.getCachedData();
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
   * @param arg schema_id string or predicate function
   * @returns A SchemaUnit object representing the column
   */
  async deleteSchemaUnit(arg: FilterType<TSchemaUnit & { key: string }>) {
    return (await this.deleteSchemaUnits(typeof arg === "string" ? [arg] : arg, false));
  }

  /**
   * Delete multiple columns from the collection schema
   * @param arg schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async deleteSchemaUnits(arg: FilterTypes<TSchemaUnit & { key: string }>, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), container: string[] = Object.keys(data.schema) as any ?? [];
    const matched: string[] = []
    if (Array.isArray(arg)) {
      for (let index = 0; index < arg.length; index++) {
        const schema_id = arg[index];
        const should_add = container.includes(schema_id);
        if (should_add) matched.push(schema_id)
        if (!multiple && matched.length === 1) break;
      }
    } else if (typeof arg === "function" || arg === undefined) {
      for (let index = 0; index < container.length; index++) {
        const should_add = typeof arg === "function" ? await arg({ ...data.schema[container[index]], key: container[index] }, index) : true;
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
