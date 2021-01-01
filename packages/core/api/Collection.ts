import { warn } from '../utils';

import Data from "./Data";
import SchemaUnit from "./SchemaUnit";

import { ICollection, IPageCreateInput, ICollectionUpdateInput, NishanArg, IPage, FilterTypes, TSchemaUnit, FilterType, UpdateTypes, UpdateType, IPageUpdateInput, TCollectionUpdateKeys, TCollectionBlock, } from "../types";
import Page from './Page';

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection> {
  constructor(args: NishanArg) {
    super({ ...args, type: "collection" });
  }

  #getRowPages = async () => {
    await this.initializeCache();
    const page_ids: string[] = [];
    for (const [_, page] of this.cache.block)
      if (page?.type === "page" && page.parent_id === this.id && !page.is_template) page_ids.push(page.id);
    return page_ids;
  }

  getCachedParentData() {
    return this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock;
  }

  /**
   * Update the collection
   * @param opt `CollectionUpdateParam`
   */
  async update(opt: ICollectionUpdateInput, execute?: boolean) {
    const [op, update] = this.updateCacheLocally(opt, TCollectionUpdateKeys)
    await this.executeUtil([
      op
    ], [], execute);
    update();
  }

  /**
   * Create multiple templates for the collection
   * @param opts Array of Objects for configuring template options
   */
  async createTemplates(rows: (Omit<IPageCreateInput, "type">)[], execute?: boolean) {
    return await this.nestedContentPopulateAndExecute(rows.map((row) => ({ ...row, is_template: true })) as any, execute);
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
  async getTemplates(args?: FilterTypes<IPage>, multiple?: boolean) {
    return (await this.getIterate<IPage>(args, {
      child_ids: "template_pages",
      multiple,
      subject_type: "Page"
    }, (page_id) => this.cache.block.get(page_id) as IPage)).map(({ id }) => new Page({ ...this.getProps(), id }))
  }

  async updateTemplate(args: UpdateType<IPage, IPageUpdateInput>, execute?: boolean) {
    return (await this.updateTemplates(typeof args === "function" ? args : [args], execute, false))[0]
  }

  async updateTemplates(args: UpdateTypes<IPage, IPageUpdateInput>, execute?: boolean, multiple?: boolean) {
    return (await this.updateIterate<IPage, IPageUpdateInput>(args, {
      child_ids: "template_pages",
      multiple,
      execute,
      child_type: "block",
      subject_type: "Page"
    }, (child_id) => this.cache.block.get(child_id) as IPage)).map(block_id => new Page({ ...this.getProps(), id: block_id }));
  }

  /**
   * Delete a single template page from the collection
   * @param args string id or a predicate function
   */
  async deleteTemplate(args?: FilterType<IPage>, execute?: boolean) {
    return await this.deleteTemplates(typeof args === "string" ? [args] : args, execute, false);
  }

  /**
   * Delete multiple template pages from the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async deleteTemplates(args?: FilterTypes<IPage>, execute?: boolean, multiple?: boolean) {
    await this.deleteIterate<IPage>(args, {
      execute, multiple,
      child_ids: "template_pages",
      child_type: "block",
      subject_type: "Page",
      child_path: "template_pages",
    }, (child_id) => this.cache.block.get(child_id) as IPage)
  }

  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async createPages(rows: Omit<IPageCreateInput, "type">[], execute?: boolean) {
    return await this.nestedContentPopulateAndExecute(rows.map((row) => ({ ...row, is_template: false })) as any, execute)
  }

  async getPage(arg?: FilterType<IPage>) {
    return (await this.getPages(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getPages(args?: FilterTypes<IPage>, multiple?: boolean) {
    return (await this.getIterate<IPage>(args, {
      child_ids: await this.#getRowPages(),
      subject_type: "Page",
      multiple
    }, (id) => this.cache.block.get(id) as IPage)).map(({ id }) => new Page({ ...this.getProps(), id }));
  }

  async updatePage(args: UpdateType<IPage, IPageUpdateInput>, execute?: boolean) {
    return (await this.updatePages(typeof args === "function" ? args : [args], execute, false))[0]
  }

  async updatePages(args: UpdateTypes<IPage, IPageUpdateInput>, execute?: boolean, multiple?: boolean) {
    return (await this.updateIterate<IPage, IPageUpdateInput>(args, {
      child_ids: await this.#getRowPages(),
      subject_type: "Page",
      execute,
      multiple,
      child_type: "block",
    }, (child_id) => this.cache.block.get(child_id) as IPage)).map(block_id => new Page({ ...this.getProps(), id: block_id }));
  }

  async deletePage(args?: FilterType<IPage>, execute?: boolean) {
    return await this.deletePages(typeof args === "string" ? [args] : args, execute, false);
  }

  /**
   * Delete multiple template pages from the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async deletePages(args?: FilterTypes<IPage>, execute?: boolean, multiple?: boolean) {
    await this.deleteIterate<IPage>(args, {
      child_ids: await this.#getRowPages(),
      subject_type: "Page",
      child_type: "block",
      execute,
      multiple
    }, (child_id) => this.cache.block.get(child_id) as IPage);
  }

  /**
   * Create multiple new columns in the collection schema
   * @param args array of Schema creation properties
   * @returns An array of SchemaUnit objects representing the columns
   */
  async createSchemaUnits(args: TSchemaUnit[], execute?: boolean) {
    const results = this.createSchemaUnitMap(), data = this.getCachedData();
    for (let index = 0; index < args.length; index++) {
      const arg = args[index], schema_id = arg.name.toLowerCase().replace(/\s/g, '_');
      if (!data.schema[schema_id]) {
        data.schema[schema_id] = arg;
        results[arg.type].push(new SchemaUnit({ schema_id, ...this.getProps(), id: this.id }) as any);
        this.logger && this.logger("CREATE", "SchemaUnit", schema_id);
      } else
        warn(`Collection:${this.id} already contains SchemaUnit:${schema_id}`)
    };

    await this.executeUtil([this.updateOp([], { schema: data.schema })], this.id, execute);
    return results;
  }

  async getSchemaUnit(arg?: FilterType<(TSchemaUnit & { key: string })>) {
    return (await this.getSchemaUnits(typeof arg === "string" ? [arg] : arg, false))
  }

  /**
   * Return multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async getSchemaUnits(args?: FilterTypes<(TSchemaUnit & { key: string })>, multiple?: boolean) {
    const schema_unit_map = this.createSchemaUnitMap(), data = this.getCachedData();
    (await this.getIterate<TSchemaUnit & { key: string }>(args, { child_ids: Object.keys(data.schema) ?? [], subject_type: "SchemaUnit", multiple }, (schema_id) => ({ ...data.schema[schema_id], key: schema_id }))).map(({ key }) => schema_unit_map[data.schema[key].type].push(new SchemaUnit({ ...this.getProps(), id: this.id, schema_id: key }) as any))
    return schema_unit_map;
  }

  /**
   * Update and return a single column from the collection schema
   * @param args schema_id string and schema properties tuple
   * @returns A SchemaUnit object representing the column
   */
  async updateSchemaUnit(arg: UpdateType<TSchemaUnit & { key: string }, Partial<TSchemaUnit>>, execute?: boolean) {
    return (await this.updateSchemaUnits(typeof arg === "function" ? arg : [arg], execute, false))
  }

  /**
   * Update and return multiple columns from the collection schema
   * @param args schema_id string and schema properties array of tuples
   * @returns An array of SchemaUnit objects representing the columns
   */
  async updateSchemaUnits(args: UpdateTypes<TSchemaUnit & { key: string }, Partial<TSchemaUnit>>, execute?: boolean, multiple?: boolean) {
    const results = this.createSchemaUnitMap(), data = this.getCachedData(), schema_ids = Object.keys(data.schema);
    await this.updateIterate<TSchemaUnit & { key: string }, Partial<TSchemaUnit>>(args, {
      child_ids: schema_ids,
      subject_type: "SchemaUnit",
      multiple,
      execute
    }, (schema_id) => {
      return { ...data.schema[schema_id], key: schema_id }
    }, (schema_id, schema_data) => {
      data.schema[schema_id] = { ...data.schema[schema_id], ...schema_data } as TSchemaUnit;
      results[data.schema[schema_id].type].push(new SchemaUnit({ schema_id, ...this.getProps(), id: this.id }) as any)
    });

    await this.executeUtil([this.updateOp([], { schema: data.schema })], this.id, execute)
    return results;
  }

  /**
   * Delete a single column from the collection schema
   * @param args schema_id string or predicate function
   * @returns A SchemaUnit object representing the column
   */
  async deleteSchemaUnit(args?: FilterType<TSchemaUnit & { key: string }>, execute?: boolean) {
    return (await this.deleteSchemaUnits(typeof args === "string" ? [args] : args, execute, false));
  }

  /**
   * Delete multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async deleteSchemaUnits(args?: FilterTypes<TSchemaUnit & { key: string }>, execute?: boolean, multiple?: boolean) {
    const data = this.getCachedData();
    await this.getIterate<TSchemaUnit & { key: string }>(args, {
      child_ids: Object.keys(data.schema) ?? [],
      multiple,
      subject_type: "SchemaUnit",
      method: "DELETE"
    }, (child_id) => {
      return { ...data.schema[child_id], key: child_id }
    }, (id) => {
      delete data.schema[id]
    });
    await this.executeUtil([this.updateOp([], { schema: data.schema })], this.id, execute)
  }
}

export default Collection;