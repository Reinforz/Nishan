import { IPageCreateInput, IPageUpdateInput, NotionFabricator, TSchemaUnitInput } from '@nishans/fabricator';
import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import { FilterType, FilterTypes, UpdateType, UpdateTypes } from '@nishans/traverser';
import { ICollection, IPage, ISchemaMapValue, TCollectionBlock, TSchemaUnit } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { CreateMaps, ICollectionUpdateInput, INotionCoreOptions, ISchemaUnitMap, TCollectionUpdateKeys } from '../';
import { transformToMultiple } from '../utils';
import Page from './Block/Page';
import Data from './Data';
import SchemaUnit from './SchemaUnit';

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection> {
	constructor (args: INotionCoreOptions) {
		super({ ...args, type: 'collection' });
	}

	async getRowPageIds () {
		await this.initializeCacheForThisData();
		const page_ids: string[] = [];
		for (const [ , page ] of this.cache.block)
			if (page.type === 'page' && page.parent_table === 'collection' && page.parent_id === this.id && !page.is_template)
				page_ids.push(page.id);
		return page_ids;
	}

	getCachedParentData () {
		return this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock;
	}

	/**
   * Update the collection
   * @param opt `CollectionUpdateParam`
   */
	async update (opt: ICollectionUpdateInput) {
		await this.updateCacheLocally(opt, TCollectionUpdateKeys);
	}

	/**
   * Create multiple templates for the collection
   * @param rows Array of Objects for configuring template options
   */
	async createTemplates (rows: IPageCreateInput[]) {
		return await NotionFabricator.CreateData.contents(rows, this.id, this.type as 'collection', this.getProps());
	}

	/**
   * Get a single template page of the collection
   * @param args string id or a predicate function
   * @returns Template page object
   */
	async getTemplate (arg?: FilterType<IPage>) {
		return (await this.getTemplates(transformToMultiple(arg), false))[0];
	}

	async getTemplates (args?: FilterTypes<IPage>, multiple?: boolean) {
		return await this.getIterate<IPage, Page[]>(
			args,
			{
				child_ids: 'template_pages',
				multiple,
				child_type: 'block',
				container: []
			},
			(page_id) => this.cache.block.get(page_id) as IPage,
			(id, _, pages) => pages.push(new Page({ ...this.getProps(), id }))
		);
	}

	async updateTemplate (arg: UpdateType<IPage, Omit<IPageUpdateInput, 'type'>>) {
		return (await this.updateTemplates(transformToMultiple(arg), false))[0];
	}

	async updateTemplates (args: UpdateTypes<IPage, Omit<IPageUpdateInput, 'type'>>, multiple?: boolean) {
		return await this.updateIterate<IPage, Omit<IPageUpdateInput, 'type'>, Page[]>(
			args,
			{
				child_ids: 'template_pages',
				multiple,
				child_type: 'block',
				container: []
			},
			(child_id) => this.cache.block.get(child_id) as IPage,
			(id, _, __, pages) => pages.push(new Page({ ...this.getProps(), id }))
		);
	}

	/**
   * Delete a single template page from the collection
   * @param args string id or a predicate function
   */
	async deleteTemplate (arg?: FilterType<IPage>) {
		await this.deleteTemplates(transformToMultiple(arg), false);
	}

	/**
   * Delete multiple template pages from the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
	async deleteTemplates (args?: FilterTypes<IPage>, multiple?: boolean) {
		await this.deleteIterate<IPage>(
			args,
			{
				multiple,
				child_ids: 'template_pages',
				child_type: 'block',
				child_path: 'template_pages',
				container: []
			},
			(child_id) => this.cache.block.get(child_id) as IPage
		);
	}

	/**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
	async createRows (rows: IPageCreateInput[]) {
		return await NotionFabricator.CreateData.contents(rows, this.id, this.type as 'collection', this.getProps());
	}

	async getRow (arg?: FilterType<IPage>) {
		return (await this.getRows(transformToMultiple(arg), false))[0];
	}

	async getRows (args?: FilterTypes<IPage>, multiple?: boolean) {
		return await this.getIterate<IPage, Page[]>(
			args,
			{
				child_ids: await this.getRowPageIds(),
				child_type: 'block',
				multiple,
				container: []
			},
			(id) => this.cache.block.get(id) as IPage,
			(id, _, pages) => pages.push(new Page({ ...this.getProps(), id }))
		);
	}

	async updateRow (arg: UpdateType<IPage, Omit<IPageUpdateInput, 'type'>>) {
		return (await this.updateRows(transformToMultiple(arg), false))[0];
	}

	async updateRows (args: UpdateTypes<IPage, Omit<IPageUpdateInput, 'type'>>, multiple?: boolean) {
		return await this.updateIterate<IPage, Omit<IPageUpdateInput, 'type'>, Page[]>(
			args,
			{
				child_ids: await this.getRowPageIds(),
				multiple,
				child_type: 'block',
				container: []
			},
			(child_id) => this.cache.block.get(child_id) as IPage,
			(id, _, __, pages) => pages.push(new Page({ ...this.getProps(), id }))
		);
	}

	async deleteRow (arg?: FilterType<IPage>) {
		return await this.deleteRows(transformToMultiple(arg), false);
	}

	/**
   * Delete multiple template pages from the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
	async deleteRows (args?: FilterTypes<IPage>, multiple?: boolean) {
		await this.deleteIterate<IPage>(
			args,
			{
				child_ids: await this.getRowPageIds(),
				child_type: 'block',
				multiple,
				container: []
			},
			(child_id) => this.cache.block.get(child_id) as IPage
		);
	}

	/**
   * Create multiple new columns in the collection schema
   * @param args array of Schema creation properties
   * @returns An array of SchemaUnit objects representing the columns
   */
	async createSchemaUnits (args: TSchemaUnitInput[]) {
		const data = this.getCachedData(),
			schema_unit_map = CreateMaps.schema_unit(),
			props = this.getProps();
		await NotionFabricator.CreateData.schema(
			args,
			{
				name: data.name,
				parent_collection_id: data.id,
				current_schema: data.schema
			},
			this.getProps(),
			(schema_unit) => {
				const schema_unit_obj = new SchemaUnit({
					id: data.id,
					...props,
					schema_id: schema_unit.schema_id
				});
				schema_unit_map[schema_unit.type].set(schema_unit.schema_id, schema_unit_obj);
				schema_unit_map[schema_unit.type].set(schema_unit.name, schema_unit_obj);
			}
		);
		await NotionOperations.executeOperations(
			[ NotionOperations.Chunk.collection.update(this.id, [ 'schema' ], data.schema) ],
			this.getProps()
		);
		return schema_unit_map;
	}

	async getSchemaUnit (arg?: FilterType<ISchemaMapValue>) {
		return await this.getSchemaUnits(transformToMultiple(arg), false);
	}

	/**
   * Return multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
	async getSchemaUnits (args?: FilterTypes<ISchemaMapValue>, multiple?: boolean) {
		// Since all the data is in the cache, no need to initialize cache
		const data = this.getCachedData(),
			schema_map = NotionUtils.generateSchemaMap(data.schema);
		return await this.getIterate<ISchemaMapValue, ISchemaUnitMap>(
			args,
			{
				container: CreateMaps.schema_unit(),
				child_ids: Array.from(schema_map.keys()),
				child_type: 'collection',
				multiple,
				initialize_cache: false
			},
			(name) => schema_map.get(name),
			(_, { schema_id, name, type }, schema_unit_map) => {
				const schema_obj = new SchemaUnit({ ...this.getProps(), id: this.id, schema_id });
				schema_unit_map[type].set(schema_id, schema_obj);
				schema_unit_map[type].set(name, schema_obj);
			}
		);
	}

	/**
   * Update and return a single column from the collection schema
   * @param args schema_id string and schema properties tuple
   * @returns A SchemaUnit object representing the column
   */
	async updateSchemaUnit (arg: UpdateType<ISchemaMapValue, Partial<TSchemaUnit>>) {
		return await this.updateSchemaUnits(transformToMultiple(arg), false);
	}

	/**
   * Update and return multiple columns from the collection schema
   * @param args schema_id string and schema properties array of tuples
   * @returns An array of SchemaUnit objects representing the columns
   */
	async updateSchemaUnits (args: UpdateTypes<ISchemaMapValue, Partial<TSchemaUnit>>, multiple?: boolean) {
		const data = this.getCachedData(),
			schema_map = NotionUtils.generateSchemaMap(data.schema);
		const results = await this.updateIterate<ISchemaMapValue, Partial<TSchemaUnit>, ISchemaUnitMap>(
			args,
			{
				child_ids: Array.from(schema_map.keys()),
				child_type: 'collection',
				multiple,
				manual: true,
				container: CreateMaps.schema_unit(),
				initialize_cache: false
			},
			(name) => schema_map.get(name),
			(_, { schema_id }, updated_data, results) => {
				data.schema[schema_id] = NotionUtils.deepMerge(data.schema[schema_id], updated_data);
				const schema_obj = new SchemaUnit({ schema_id, ...this.getProps(), id: this.id });
				results[data.schema[schema_id].type].set(schema_id, schema_obj);
				results[data.schema[schema_id].type].set(data.schema[schema_id].name, schema_obj);
			}
		);
		await NotionOperations.executeOperations(
			[ NotionOperations.Chunk.collection.update(this.id, [ 'schema' ], data.schema) ],
			this.getProps()
		);
		return results;
	}

	/**
   * Delete a single column from the collection schema
   * @param args schema_id string or predicate function
   * @returns A SchemaUnit object representing the column
   */
	async deleteSchemaUnit (args?: FilterType<ISchemaMapValue>) {
		return await this.deleteSchemaUnits(transformToMultiple(args), false);
	}

	/**
   * Delete multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
	async deleteSchemaUnits (args?: FilterTypes<ISchemaMapValue>, multiple?: boolean) {
		const data = this.getCachedData(),
			schema_map = NotionUtils.generateSchemaMap(data.schema);
		await this.deleteIterate<ISchemaMapValue>(
			args,
			{
				child_ids: Array.from(schema_map.keys()),
				child_type: 'collection',
				multiple,
				manual: true,
				container: [],
				initialize_cache: false
			},
			(name) => schema_map.get(name),
			(_, { schema_id }) => {
				if (schema_id === 'title')
					NotionLogger.error(`Title schema unit cannot be deleted`);
				delete data.schema[schema_id];
			}
		);
		await NotionOperations.executeOperations(
			[ NotionOperations.Chunk.collection.update(this.id, [ 'schema' ], data.schema) ],
			this.getProps()
		);
	}
}

export default Collection;
