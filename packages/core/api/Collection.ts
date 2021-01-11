import { createSchemaUnitMap, nestedContentPopulate, Operation, parseFormula, slugify, warn } from '../utils';

import Data from "./Data";
import SchemaUnit from "./SchemaUnit";

import Page from './Page';
import { ICollection, TCollectionBlock, IPage, TSchemaUnit } from '@nishans/types';
import { NishanArg, ICollectionUpdateInput, TCollectionUpdateKeys, IPageCreateInput, FilterType, FilterTypes, UpdateType, IPageUpdateInput, UpdateTypes, TSchemaUnitInput } from '../types';

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

  getSchemaMap = () =>{
    const data = this.getCachedData(), schema_map: Map<string, {property: string} & TSchemaUnit> = new Map();
    Object.entries(data.schema).forEach(([schema_id, schema_unit])=>{
      schema_map.set(schema_unit.name, {
        property: schema_id,
        ...schema_unit
      })
    })
    return schema_map;
  }

  /**
   * Update the collection
   * @param opt `CollectionUpdateParam`
   */
  update(opt: ICollectionUpdateInput) {
    this.updateCacheLocally(opt, TCollectionUpdateKeys)
  }

  /**
   * Create multiple templates for the collection
   * @param opts Array of Objects for configuring template options
   */
  async createTemplates(rows: (Omit<IPageCreateInput, "type">)[]) {
    return await nestedContentPopulate(rows.map((row) => ({ ...row, is_template: true })) as any, this.id, this.type, this.getProps(), this.id)
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
    const pages: Page[] = [];
    (await this.getIterate<IPage>(args, {
      child_ids: "template_pages",
      multiple,
      child_type: "block"
    }, (page_id) => this.cache.block.get(page_id) as IPage, (id)=> pages.push(new Page({ ...this.getProps(), id }))));
    return pages;
  }

  async updateTemplate(args: UpdateType<IPage, IPageUpdateInput>) {
    return (await this.updateTemplates(typeof args === "function" ? args : [args], false))[0]
  }

  async updateTemplates(args: UpdateTypes<IPage, IPageUpdateInput>, multiple?: boolean) {
    const pages: Page[] = [];
    (await this.updateIterate<IPage, IPageUpdateInput>(args, {
      child_ids: "template_pages",
      multiple,
      child_type: "block",
    }, (child_id) => this.cache.block.get(child_id) as IPage, (id)=>pages.push(new Page({ ...this.getProps(), id }))));
    return pages;
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
    await this.deleteIterate<IPage>(args, {
      multiple,
      child_ids: "template_pages",
      child_type: "block",
      child_path: "template_pages",
    }, (child_id) => this.cache.block.get(child_id) as IPage)
  }

  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async createPages(rows: Omit<IPageCreateInput, "type">[]) {
    return await nestedContentPopulate(rows.map((row) => ({ ...row, is_template: false })) as any, this.id, this.type, this.getProps(), this.id)
  }

  async getPage(arg?: FilterType<IPage>) {
    return (await this.getPages(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getPages(args?: FilterTypes<IPage>, multiple?: boolean) {
    const pages: Page[] = [];
    (await this.getIterate<IPage>(args, {
      child_ids: await this.#getRowPages(),
      child_type: "block",
      multiple
    }, (id) => this.cache.block.get(id) as IPage, (id)=>pages.push(new Page({ ...this.getProps(), id }))));
    return pages;
  }

  async updatePage(args: UpdateType<IPage, IPageUpdateInput>) {
    return (await this.updatePages(typeof args === "function" ? args : [args], false))[0]
  }

  async updatePages(args: UpdateTypes<IPage, IPageUpdateInput>, multiple?: boolean) {
    const pages: Page[] = [];
    (await this.updateIterate<IPage, IPageUpdateInput>(args, {
      child_ids: await this.#getRowPages(),
      multiple,
      child_type: "block",
    }, (child_id) => this.cache.block.get(child_id) as IPage, (id)=>pages.push(new Page({ ...this.getProps(), id }))));
    return pages;
  }

  async deletePage(args?: FilterType<IPage>) {
    return await this.deletePages(typeof args === "string" ? [args] : args,  false);
  }

  /**
   * Delete multiple template pages from the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async deletePages(args?: FilterTypes<IPage>, multiple?: boolean) {
    await this.deleteIterate<IPage>(args, {
      child_ids: await this.#getRowPages(),
      child_type: "block",
      multiple
    }, (child_id) => this.cache.block.get(child_id) as IPage);
  }

  /**
   * Create multiple new columns in the collection schema
   * @param args array of Schema creation properties
   * @returns An array of SchemaUnit objects representing the columns
   */
  createSchemaUnits(args: TSchemaUnitInput[]) {
    const results = createSchemaUnitMap(), data = this.getCachedData();
    for (let index = 0; index < args.length; index++) {
      const arg = args[index], schema_id = slugify(arg.name);
      if (!data.schema[schema_id]) {
        if(arg.type === "formula") data.schema[schema_id] = {...arg, formula: parseFormula(arg.formula, this.getSchemaMap()) }
        else data.schema[schema_id] = arg;
        const schema_obj = new SchemaUnit({ schema_id, ...this.getProps(), id: this.id })
        results[arg.type].set(schema_id, schema_obj);
        results[arg.type].set(arg.name, schema_obj);
        this.logger && this.logger("CREATE", "collection", schema_id);
      } else
        warn(`Collection:${this.id} already contains SchemaUnit:${schema_id}`)
    };

    this.stack.push(Operation.collection.update(this.id, [], { schema: data.schema }));
    this.updateLastEditedProps();
    return results;
  }

  async getSchemaUnit(arg?: FilterType<(TSchemaUnit & { property: string })>) {
    return (await this.getSchemaUnits(typeof arg === "string" ? [arg] : arg, false))
  }

  /**
   * Return multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async getSchemaUnits(args?: FilterTypes<(TSchemaUnit & { property: string })>, multiple?: boolean) {
    const schema_unit_map = createSchemaUnitMap(), data = this.getCachedData();
    (await this.getIterate<TSchemaUnit & { property: string }>(args, { child_ids: Object.keys(data.schema) ?? [], child_type: "collection", multiple }, (schema_id) => ({ ...data.schema[schema_id], property: schema_id }), (_, { property, name, type })=>{
      const schema_obj = new SchemaUnit({ ...this.getProps(), id: this.id, schema_id: property });
      schema_unit_map[type].set(property, schema_obj)  
      schema_unit_map[type].set(name, schema_obj)  
    }))
    return schema_unit_map;
  }

  /**
   * Update and return a single column from the collection schema
   * @param args schema_id string and schema properties tuple
   * @returns A SchemaUnit object representing the column
   */
  async updateSchemaUnit(arg: UpdateType<TSchemaUnit & { property: string }, Partial<TSchemaUnit>>) {
    return (await this.updateSchemaUnits(typeof arg === "function" ? arg : [arg], false))
  }

  /**
   * Update and return multiple columns from the collection schema
   * @param args schema_id string and schema properties array of tuples
   * @returns An array of SchemaUnit objects representing the columns
   */
  async updateSchemaUnits(args: UpdateTypes<TSchemaUnit & { property: string }, Partial<TSchemaUnit>>, multiple?: boolean) {
    const results = createSchemaUnitMap(), data = this.getCachedData();
    await this.updateIterate<TSchemaUnit & { property: string }, Partial<TSchemaUnit>>(args, {
      child_ids: Object.keys(data.schema),
      child_type: "collection",
      multiple,
      manual: true
    }, (schema_id) => ({ ...data.schema[schema_id], property: schema_id }), (schema_id, {type, name}, updated_data) => {
      data.schema[schema_id] = { ...data.schema[schema_id], ...updated_data } as TSchemaUnit;
      type = updated_data.type ?? type;
      const schema_obj = new SchemaUnit({ schema_id, ...this.getProps(), id: this.id })
      results[type].set(schema_id, schema_obj)
      results[type].set(name, schema_obj)
    });
    this.updateLastEditedProps();
    this.stack.push(Operation.collection.update(this.id,[], { schema: data.schema }))
    return results;
  }

  /**
   * Delete a single column from the collection schema
   * @param args schema_id string or predicate function
   * @returns A SchemaUnit object representing the column
   */
  async deleteSchemaUnit(args?: FilterType<TSchemaUnit & { property: string }>) {
    return (await this.deleteSchemaUnits(typeof args === "string" ? [args] : args, false));
  }

  /**
   * Delete multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async deleteSchemaUnits(args?: FilterTypes<TSchemaUnit & { property: string }>, multiple?: boolean) {
    const data = this.getCachedData();
    await this.deleteIterate<TSchemaUnit & { property: string }>(args, {
      child_ids: Object.keys(data.schema),
      child_type: "collection",
      multiple,
      manual: true
    }, (child_id) => ({ ...data.schema[child_id], property: child_id }), (id) => {
      delete data.schema[id]
    });
    this.updateLastEditedProps();
    this.stack.push(Operation.collection.update(this.id,[], { schema: data.schema }) )
  }
}

export default Collection;