import { Operation } from '@nishans/operations';
import { ICollection, IPage, TCollectionBlock, TSchemaUnit } from '@nishans/types';
import { FilterType, FilterTypes, ICollectionUpdateInput, IPageCreateInput, IPageUpdateInput, ISchemaMapValue, ISchemaUnitMap, NishanArg, TCollectionUpdateKeys, TSchemaUnitInput, UpdateType, UpdateTypes } from '../types';
import { createSchemaUnitMap, getSchemaMap, CreateData, transformToMultiple,} from '../utils';
import Data from "./Data";
import Page from './Page';
import SchemaUnit from "./SchemaUnit";

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection> {

  constructor(args: NishanArg) {
    super({ ...args, type: "collection" });
  }

  async getRowPageIds(){
    await this.initializeCacheForThisData();
    const page_ids: string[] = [];
    for (const [_, page] of this.cache.block)
      if (page.type === "page" && page.parent_table === "collection" && page.parent_id === this.id && !page.is_template) page_ids.push(page.id);
    return page_ids;
  }

  getCachedParentData() {
    return this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock;
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
   * @param rows Array of Objects for configuring template options
   */
  async createTemplates(rows: IPageCreateInput[]) {
    return await CreateData.createContents(rows, this.id, this.type as "collection", this.getProps())
  }

  /**
   * Get a single template page of the collection
   * @param args string id or a predicate function
   * @returns Template page object
   */
  async getTemplate(arg?: FilterType<IPage>) {
    return (await this.getTemplates(transformToMultiple(arg), false))[0]
  }

  async getTemplates(args?: FilterTypes<IPage>, multiple?: boolean) {
    return await this.getIterate<IPage, Page[]>(args, {
      child_ids: "template_pages",
      multiple,
      child_type: "block",
      container: []
    }, (page_id) => this.cache.block.get(page_id) as IPage, (id,_,pages) => pages.push(new Page({ ...this.getProps(), id })));
  }

  async updateTemplate(arg: UpdateType<IPage, Omit<IPageUpdateInput, "type">>) {
    return (await this.updateTemplates(transformToMultiple(arg), false))[0]
  }

  async updateTemplates(args: UpdateTypes<IPage, Omit<IPageUpdateInput, "type">>, multiple?: boolean) {
    return await this.updateIterate<IPage, Omit<IPageUpdateInput, "type">, Page[]>(args, {
      child_ids: "template_pages",
      multiple,
      child_type: "block",
      container: [],
    }, (child_id) => this.cache.block.get(child_id) as IPage, 
      (id,_,__,pages) => pages.push(new Page({ ...this.getProps(), id })));
  }

  /**
   * Delete a single template page from the collection
   * @param args string id or a predicate function
   */
  async deleteTemplate(arg?: FilterType<IPage>) {
    await this.deleteTemplates(transformToMultiple(arg), false);
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
      container: []
    }, (child_id) => this.cache.block.get(child_id) as IPage)
  }

  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async createRows(rows: IPageCreateInput[]) {
    return await CreateData.createContents(rows, this.id, this.type as "collection", this.getProps())
  }

  async getRow(arg?: FilterType<IPage>) {
    return (await this.getRows(transformToMultiple(arg), false))[0]
  }

  async getRows(args?: FilterTypes<IPage>, multiple?: boolean) {
    return await this.getIterate<IPage, Page[]>(args, {
      child_ids: await this.getRowPageIds(),
      child_type: "block",
      multiple,
      container: []
    }, (id) => this.cache.block.get(id) as IPage, (id,_,pages) => pages.push(new Page({ ...this.getProps(), id })));
  }

  async updateRow(arg: UpdateType<IPage, Omit<IPageUpdateInput, "type">>) {
    return (await this.updateRows(transformToMultiple(arg), false))[0]
  }

  async updateRows(args: UpdateTypes<IPage, Omit<IPageUpdateInput, "type">>, multiple?: boolean) {
    return await this.updateIterate<IPage, Omit<IPageUpdateInput, "type">, Page[]>(args, {
      child_ids: await this.getRowPageIds(),
      multiple,
      child_type: "block",
      container: [],
    }, (child_id) => this.cache.block.get(child_id) as IPage, (id,_,__,pages) => pages.push(new Page({ ...this.getProps(), id })));
  }

  async deleteRow(arg?: FilterType<IPage>) {
    return await this.deleteRows(transformToMultiple(arg), false);
  }

  /**
   * Delete multiple template pages from the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async deleteRows(args?: FilterTypes<IPage>, multiple?: boolean) {
    await this.deleteIterate<IPage>(args, {
      child_ids: await this.getRowPageIds(),
      child_type: "block",
      multiple,
      container: [],
      manual: true
    }, (child_id) => this.cache.block.get(child_id) as IPage, (child_id, child_data)=>{
      child_data.alive = false;
      this.updateLastEditedProps(child_data)
      this.Operations.stack.push(Operation.block.update(child_id, [], { alive: false , ...this.getLastEditedProps()}));
    });
  }

  /**
   * Create multiple new columns in the collection schema
   * @param args array of Schema creation properties
   * @returns An array of SchemaUnit objects representing the columns
   */
  async createSchemaUnits(args: TSchemaUnitInput[]) {
    const schema_unit_map = createSchemaUnitMap(), data = this.getCachedData();
    const [generated_schema] = await CreateData.createSchema(args, {
      ...this.getProps(),
      name: data.name,
      parent_collection_id: data.id
    });

    Object.entries(generated_schema).forEach(([schema_id, schema_unit])=>{
      schema_unit_map[schema_unit.type].set(schema_id, new SchemaUnit({ schema_id, ...this.getProps(), id: this.id }) as any);
      schema_unit_map[schema_unit.type].set(schema_unit.name, new SchemaUnit({ schema_id, ...this.getProps(), id: this.id }) as any);
    })
    
    this.Operations.stack.push(Operation.collection.update(this.id, [], { schema: data.schema }));
    this.updateLastEditedProps();
    return schema_unit_map;
  }

  async getSchemaUnit(arg?: FilterType<ISchemaMapValue>) {
    return (await this.getSchemaUnits(transformToMultiple(arg), false))
  }

  /**
   * Return multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async getSchemaUnits(args?: FilterTypes<ISchemaMapValue>, multiple?: boolean) {
    const data = this.getCachedData(), schema_map = getSchemaMap(data.schema);
    return await this.getIterate<ISchemaMapValue, ISchemaUnitMap>(args, { container: createSchemaUnitMap(), child_ids: Array.from(schema_map.keys()), child_type: "collection", multiple }, (name) =>
      schema_map.get(name) as ISchemaMapValue, (_, { schema_id, name, type }, schema_unit_map) => {
        const schema_obj = new SchemaUnit({ ...this.getProps(), id: this.id, schema_id });
        schema_unit_map[type].set(schema_id, schema_obj)
        schema_unit_map[type].set(name, schema_obj)
      })
  }

  /**
   * Update and return a single column from the collection schema
   * @param args schema_id string and schema properties tuple
   * @returns A SchemaUnit object representing the column
   */
  async updateSchemaUnit(arg: UpdateType<ISchemaMapValue, Partial<TSchemaUnit>>) {
    return (await this.updateSchemaUnits(typeof arg === "function" ? arg : [arg], false))
  }

  /**
   * Update and return multiple columns from the collection schema
   * @param args schema_id string and schema properties array of tuples
   * @returns An array of SchemaUnit objects representing the columns
   */
  async updateSchemaUnits(args: UpdateTypes<ISchemaMapValue, Partial<TSchemaUnit>>, multiple?: boolean) {
    const data = this.getCachedData(), schema_map = getSchemaMap(data.schema);
    const results = await this.updateIterate<ISchemaMapValue, Partial<TSchemaUnit>, ISchemaUnitMap>(args, {
      child_ids: Array.from(schema_map.keys()),
      child_type: "collection",
      multiple,
      manual: true,
      container: createSchemaUnitMap()
    }, (name) => schema_map.get(name) as ISchemaMapValue,
      (_, { schema_id, type, name }, updated_data, results) => {
      data.schema[schema_id] = { ...data.schema[schema_id], ...updated_data } as TSchemaUnit;
      type = updated_data.type ?? type;
      const schema_obj = new SchemaUnit({ schema_id, ...this.getProps(), id: this.id })
      results[type].set(schema_id, schema_obj)
      results[type].set(name, schema_obj)
    });
    this.updateLastEditedProps();
    this.Operations.stack.push(Operation.collection.update(this.id, [], { schema: data.schema }))
    return results;
  }

  /**
   * Delete a single column from the collection schema
   * @param args schema_id string or predicate function
   * @returns A SchemaUnit object representing the column
   */
  async deleteSchemaUnit(args?: FilterType<ISchemaMapValue>) {
    return (await this.deleteSchemaUnits(typeof args === "string" ? [args] : args, false));
  }

  /**
   * Delete multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async deleteSchemaUnits(args?: FilterTypes<ISchemaMapValue>, multiple?: boolean) {
    const data = this.getCachedData(), schema_map = getSchemaMap(data.schema);
    await this.deleteIterate<ISchemaMapValue>(args, {
      child_ids: Array.from(schema_map.keys()),
      child_type: "collection",
      multiple,
      manual: true,
      container: []
    }, (name) => {
      const schema_unit_data = schema_map.get(name) as ISchemaMapValue;
      return { ...schema_unit_data, schema_id: schema_unit_data.schema_id };
    }, (_, { schema_id }) => {
      delete data.schema[schema_id]
    });
    this.updateLastEditedProps();
    this.Operations.stack.push(Operation.collection.update(this.id, [], { schema: data.schema }))
  }
}

export default Collection;