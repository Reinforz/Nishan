import { v4 as uuidv4 } from 'uuid';

import { error, Operation } from '../utils';

import Data from "./Data";
import SchemaUnit from "./SchemaUnit";

import { ICollection, IPageInput, UpdatableCollectionUpdateParam, NishanArg, IOperation, RepositionParams, IPage, FilterTypes, TSchemaUnit, FilterType, TSchemaUnitType, TextSchemaUnit, NumberSchemaUnit, SelectSchemaUnit, MultiSelectSchemaUnit, CheckboxSchemaUnit, DateSchemaUnit, FileSchemaUnit, PersonSchemaUnit, TitleSchemaUnit, EmailSchemaUnit, PhoneNumberSchemaUnit, UrlSchemaUnit, CreatedBySchemaUnit, CreatedTimeSchemaUnit, FormulaSchemaUnit, LastEditedBySchemaUnit, LastEditedTimeSchemaUnit, RelationSchemaUnit, RollupSchemaUnit, PageProps, PageFormat, } from "../types";
import Page from './Page';

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection> {
  constructor(args: NishanArg) {
    super({ ...args, type: "collection" });
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
    return this.getItems<IPage>(args as any, multiple, async function (page) {
      return new Page({
        ..._this.getProps(),
        id: page.id
      }) as any
    })
  }

  async updateTemplate(id: string, opt: Omit<IPageInput, "type">) {
    await this.updateTemplates([[id, opt]]);
  }

  async updateTemplates(args: [string, Omit<IPageInput, "type">][]) {
    const data = this.getCachedData(), ops: IOperation[] = [], current_time = Date.now(), block_ids: string[] = [];
    for (let index = 0; index < args.length; index++) {
      const [id, opts] = args[index];
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

  async getPages(args?: FilterTypes<IPage>, multiple?: boolean) {
    multiple = multiple ?? true;
    const matched: Page[] = [];
    await this.initializeCache();

    const page_ids: string[] = [];
    for (let [_, page] of this.cache.block) {
      if (page.type === "page" && page.parent_id === this.id) page_ids.push(page.id)
    }
    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const id = args[index];
        const should_add = page_ids.includes(id);
        if (should_add)
          matched.push(new Page({ ...this.getProps(), id }))
        if (!multiple && matched.length === 1) break;
      }
    } else if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < page_ids.length; index++) {
        const page_id = page_ids[index],
          page = this.cache.block.get(page_id) as IPage;
        const should_add = typeof args === "function" ? await args(page, index) : true;
        if (should_add)
          matched.push(new Page({ ...this.getProps(), id: page_id, }))
        if (!multiple && matched.length === 1) break;
      }
    }
    return matched;
  }

  async createPage(row: { format?: Partial<PageFormat>, properties: PageProps }) {
    return (await this.createPages([row]))[0]
  }

  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async createPages(rows: { format?: Partial<PageFormat>, properties: PageProps }[]) {
    const page_ids: string[] = [];
    const ops: IOperation[] = [];
    rows.map(({ format, properties }) => {
      const page_id = uuidv4();
      page_ids.push(page_id);
      ops.push(
        Operation.block.update(page_id, [], {
          alive: true,
          id: page_id,
          type: "page",
          properties,
          format,
          parent_id: this.id,
          parent_table: 'collection',
        })
      );
    });
    await this.saveTransactions(ops)
    await this.updateCacheManually(page_ids)

    return page_ids.map((page_id) => new Page({
      id: page_id,
      ...this.getProps()
    }))
  }

  /* async readPages(args: FilterTypes<IPage>, multiple?: boolean) {
    multiple = multiple ?? true;

  } */

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

  #createClass = (type: TSchemaUnitType, schema_id: string) => {
    const args = ({ ...this.getProps(), id: this.id, schema_id })
    switch (type) {
      case "text":
        return new SchemaUnit<TextSchemaUnit>(args)
      case "number":
        return new SchemaUnit<NumberSchemaUnit>(args)
      case "select":
        return new SchemaUnit<SelectSchemaUnit>(args)
      case "multi_select":
        return new SchemaUnit<MultiSelectSchemaUnit>(args)
      case "title":
        return new SchemaUnit<TitleSchemaUnit>(args)
      case "date":
        return new SchemaUnit<DateSchemaUnit>(args)
      case "person":
        return new SchemaUnit<PersonSchemaUnit>(args)
      case "file":
        return new SchemaUnit<FileSchemaUnit>(args)
      case "checkbox":
        return new SchemaUnit<CheckboxSchemaUnit>(args)
      case "url":
        return new SchemaUnit<UrlSchemaUnit>(args)
      case "email":
        return new SchemaUnit<EmailSchemaUnit>(args)
      case "phone_number":
        return new SchemaUnit<PhoneNumberSchemaUnit>(args)
      case "formula":
        return new SchemaUnit<FormulaSchemaUnit>(args)
      case "relation":
        return new SchemaUnit<RelationSchemaUnit>(args)
      case "rollup":
        return new SchemaUnit<RollupSchemaUnit>(args)
      case "created_time":
        return new SchemaUnit<CreatedTimeSchemaUnit>(args)
      case "created_by":
        return new SchemaUnit<CreatedBySchemaUnit>(args)
      case "last_edited_time":
        return new SchemaUnit<LastEditedTimeSchemaUnit>(args)
      case "last_edited_by":
        return new SchemaUnit<LastEditedBySchemaUnit>(args)
      default:
        return new SchemaUnit<TextSchemaUnit>(args)
    }
  }

  /**
   * Return a single column from the collection schema
   * @param args schema_id string or predicate function
   * @returns A SchemaUnit object representing the column
   */
  async getSchemaUnit(args?: FilterType<TSchemaUnit & { key: string }>) {
    return (await this.getSchemaUnits(typeof args === "string" ? [args] : args, false))[0];
  }

  /**
   * Return multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async getSchemaUnits(args?: FilterTypes<(TSchemaUnit & { key: string })>, multiple?: boolean, type?: TSchemaUnitType) {
    multiple = multiple ?? true;
    const matched: SchemaUnit<TSchemaUnit>[] = [];
    const data = this.getCachedData(), container: string[] = Object.keys(data.schema) as any ?? [];

    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const schema_id = args[index], schema = data.schema[schema_id];
        const should_add = (type ? schema.type === type : true) && container.includes(schema_id);
        if (should_add)
          matched.push(this.#createClass(schema.type, schema_id))
        if (!multiple && matched.length === 1) break;
      }
    } else if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < container.length; index++) {
        const schema_id = container[index], schema = data.schema[container[index]];
        const should_add = (type ? schema.type === type : true) && (typeof args === "function" ? await args({ ...schema, key: container[index] }, index) : true);
        if (should_add)
          matched.push(this.#createClass(schema.type, schema_id))
        if (!multiple && matched.length === 1) break;
      }
    }
    return matched;
  }

  // ? TD:2:M Fix args as any type error

  async getTextSchemaUnit(args?: FilterType<TextSchemaUnit & { key: string }>) {
    return (await this.getTextSchemaUnits(args as any, false))[0]
  }

  async getTextSchemaUnits(args?: FilterTypes<TextSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<TextSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "text")
  }

  async getNumberSchemaUnit(args?: FilterType<NumberSchemaUnit & { key: string }>) {
    return (await this.getNumberSchemaUnits(args as any, false))[0]
  }

  async getNumberSchemaUnits(args?: FilterTypes<NumberSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<NumberSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "number")
  }

  async getSelectSchemaUnit(args?: FilterType<SelectSchemaUnit & { key: string }>) {
    return (await this.getSelectSchemaUnits(args as any, false))[0]
  }

  async getSelectSchemaUnits(args?: FilterTypes<SelectSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<SelectSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "select")
  }

  async getMultiSelectSchemaUnit(args?: FilterType<MultiSelectSchemaUnit & { key: string }>) {
    return (await this.getMultiSelectSchemaUnits(args as any, false))[0]
  }

  async getMultiSelectSchemaUnits(args?: FilterTypes<MultiSelectSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<MultiSelectSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "multi_select")
  }

  async getTitleSchemaUnit(args?: FilterType<TitleSchemaUnit & { key: string }>) {
    return (await this.getTitleSchemaUnits(args as any, false))[0]
  }

  async getTitleSchemaUnits(args?: FilterTypes<TitleSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<TitleSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "title")
  }

  async getDateSchemaUnit(args?: FilterType<DateSchemaUnit & { key: string }>) {
    return (await this.getDateSchemaUnits(args as any, false))[0]
  }

  async getDateSchemaUnits(args?: FilterTypes<DateSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<DateSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "date")
  }

  async getPersonSchemaUnit(args?: FilterType<PersonSchemaUnit & { key: string }>) {
    return (await this.getPersonSchemaUnits(args as any, false))[0]
  }

  async getPersonSchemaUnits(args?: FilterTypes<PersonSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<PersonSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "person")
  }

  async getFileSchemaUnit(args?: FilterType<FileSchemaUnit & { key: string }>) {
    return (await this.getFileSchemaUnits(args as any, false))[0]
  }

  async getFileSchemaUnits(args?: FilterTypes<FileSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<FileSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "file")
  }

  async getCheckboxSchemaUnit(args?: FilterType<CheckboxSchemaUnit & { key: string }>) {
    return (await this.getCheckboxSchemaUnits(args as any, false))[0]
  }

  async getCheckboxSchemaUnits(args?: FilterTypes<CheckboxSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<CheckboxSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "checkbox")
  }

  async getUrlSchemaUnit(args?: FilterType<UrlSchemaUnit & { key: string }>) {
    return (await this.getUrlSchemaUnits(args as any, false))[0]
  }

  async getUrlSchemaUnits(args?: FilterTypes<UrlSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<UrlSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "url")
  }

  async getEmailSchemaUnit(args?: FilterType<EmailSchemaUnit & { key: string }>) {
    return (await this.getEmailSchemaUnits(args as any, false))[0]
  }

  async getEmailSchemaUnits(args?: FilterTypes<EmailSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<EmailSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "email")
  }

  async getPhoneNumberSchemaUnit(args?: FilterType<PhoneNumberSchemaUnit & { key: string }>) {
    return (await this.getPhoneNumberSchemaUnits(args as any, false))[0]
  }

  async getPhoneNumberSchemaUnits(args?: FilterTypes<PhoneNumberSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<PhoneNumberSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "phone_number")
  }

  async getFormulaSchemaUnit(args?: FilterType<FormulaSchemaUnit & { key: string }>) {
    return (await this.getFormulaSchemaUnits(args as any, false))[0]
  }

  async getFormulaSchemaUnits(args?: FilterTypes<FormulaSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<FormulaSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "formula")
  }

  async getRelationSchemaUnit(args?: FilterType<RelationSchemaUnit & { key: string }>) {
    return (await this.getRelationSchemaUnits(args as any, false))[0]
  }

  async getRelationSchemaUnits(args?: FilterTypes<RelationSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<RelationSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "relation")
  }

  async getRollupSchemaUnit(args?: FilterType<RollupSchemaUnit & { key: string }>) {
    return (await this.getRollupSchemaUnits(args as any, false))[0]
  }

  async getRollupSchemaUnits(args?: FilterTypes<RollupSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<RollupSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "rollup")
  }

  async getCreatedTimeSchemaUnit(args?: FilterType<CreatedTimeSchemaUnit & { key: string }>) {
    return (await this.getCreatedTimeSchemaUnits(args as any, false))[0]
  }

  async getCreatedTimeSchemaUnits(args?: FilterTypes<CreatedTimeSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<CreatedTimeSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "created_time")
  }

  async getCreatedBySchemaUnit(args?: FilterType<CreatedBySchemaUnit & { key: string }>) {
    return (await this.getCreatedBySchemaUnits(args as any, false))[0]
  }

  async getCreatedBySchemaUnits(args?: FilterTypes<CreatedBySchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<CreatedBySchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "created_by")
  }

  async getLastEditedTimeSchemaUnit(args?: FilterType<LastEditedTimeSchemaUnit & { key: string }>) {
    return (await this.getLastEditedTimeSchemaUnits(args as any, false))[0]
  }

  async getLastEditedTimeSchemaUnits(args?: FilterTypes<LastEditedTimeSchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<LastEditedTimeSchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "last_edited_time")
  }

  async getLastEditedBySchemaUnit(args?: FilterType<LastEditedBySchemaUnit & { key: string }>) {
    return (await this.getLastEditedBySchemaUnits(args as any, false))[0]
  }

  async getLastEditedBySchemaUnits(args?: FilterTypes<LastEditedBySchemaUnit & { key: string }>, multiple?: boolean): Promise<SchemaUnit<LastEditedBySchemaUnit>[]> {
    return await this.getSchemaUnits(args as any, multiple ?? true, "last_edited_by")
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
    const data = this.getCachedData(), container: string[] = Object.keys(data.schema) as any ?? [];
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