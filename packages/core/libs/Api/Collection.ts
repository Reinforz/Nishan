import {
  IPageCreateInput,
  IPageUpdateInput,
  NotionFabricator,
  TSchemaUnitInput
} from '@nishans/fabricator';
import { NotionLineage } from '@nishans/lineage';
import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import {
  FilterType,
  FilterTypes,
  UpdateType,
  UpdateTypes
} from '@nishans/traverser';
import {
  ICollection,
  IPage,
  ISchemaMapValue,
  TCollectionBlock,
  TSchemaUnit
} from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import {
  ICollectionUpdateInput,
  INotionCoreOptions,
  ISchemaUnitMap,
  NotionCore
} from '../';
import { PopulateMap } from '../PopulateMap';
import { transformToMultiple } from '../utils';
import Page from './Block/Page';
import Data from './Data';

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection, ICollectionUpdateInput> {
  constructor(args: INotionCoreOptions) {
    super({ ...args, type: 'collection' });
  }

  getCachedParentData() {
    return this.cache.block.get(
      this.getCachedData().parent_id
    ) as TCollectionBlock;
  }

  /**
   * Create multiple templates for the collection
   * @param rows Array of Objects for configuring template options
   */
  async createTemplates(rows: IPageCreateInput[]) {
    return await NotionFabricator.CreateData.contents(
      rows,
      this.id,
      this.type as 'collection',
      this.getProps()
    );
  }

  /**
   * Get a single template page of the collection
   * @param args string id or a predicate function
   * @returns Template page object
   */
  async getTemplate(arg?: FilterType<IPage>) {
    return (await this.getTemplates(transformToMultiple(arg), false))[0];
  }

  async getTemplates(args?: FilterTypes<IPage>, multiple?: boolean) {
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

  async updateTemplate(arg: UpdateType<IPage, Omit<IPageUpdateInput, 'type'>>) {
    return (await this.updateTemplates(transformToMultiple(arg), false))[0];
  }

  async updateTemplates(
    args: UpdateTypes<IPage, Omit<IPageUpdateInput, 'type'>>,
    multiple?: boolean
  ) {
    return await this.updateIterate<
      IPage,
      Omit<IPageUpdateInput, 'type'>,
      Page[]
    >(
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
  async deleteTemplate(arg?: FilterType<IPage>) {
    return await this.deleteTemplates(transformToMultiple(arg), false);
  }

  /**
   * Delete multiple template pages from the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async deleteTemplates(args?: FilterTypes<IPage>, multiple?: boolean) {
    return await this.deleteIterate<IPage, Page[]>(
      args,
      {
        multiple,
        child_ids: 'template_pages',
        child_type: 'block',
        child_path: 'template_pages',
        container: []
      },
      (child_id) => this.cache.block.get(child_id) as IPage,
      async (id, _, container) =>
        container.push(new Page({ ...this.getProps(), id }))
    );
  }

  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async createRows(rows: IPageCreateInput[]) {
    return await NotionFabricator.CreateData.contents(
      rows,
      this.id,
      this.type as 'collection',
      this.getProps()
    );
  }

  async getRow(arg?: FilterType<IPage>) {
    return (await this.getRows(transformToMultiple(arg), false))[0];
  }

  async getRows(args?: FilterTypes<IPage>, multiple?: boolean) {
    await this.initializeCacheForThisData();
    const row_page_ids = await NotionLineage.Collection.getRowPageIds(
      this.id,
      this.getProps()
    );
    return await this.getIterate<IPage, Page[]>(
      args,
      {
        child_ids: row_page_ids,
        child_type: 'block',
        multiple,
        container: [],
        initialize_cache: false
      },
      (id) => this.cache.block.get(id) as IPage,
      (id, _, pages) => pages.push(new Page({ ...this.getProps(), id }))
    );
  }

  async updateRow(arg: UpdateType<IPage, Omit<IPageUpdateInput, 'type'>>) {
    return (await this.updateRows(transformToMultiple(arg), false))[0];
  }

  async updateRows(
    args: UpdateTypes<IPage, Omit<IPageUpdateInput, 'type'>>,
    multiple?: boolean
  ) {
    return await this.updateIterate<
      IPage,
      Omit<IPageUpdateInput, 'type'>,
      Page[]
    >(
      args,
      {
        child_ids: await NotionLineage.Collection.getRowPageIds(
          this.id,
          this.getProps()
        ),
        multiple,
        child_type: 'block',
        container: []
      },
      (child_id) => this.cache.block.get(child_id) as IPage,
      (id, _, __, pages) => pages.push(new Page({ ...this.getProps(), id }))
    );
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
    return await this.deleteIterate<IPage, Page[]>(
      args,
      {
        child_ids: await NotionLineage.Collection.getRowPageIds(
          this.id,
          this.getProps()
        ),
        child_type: 'block',
        multiple,
        container: []
      },
      (child_id) => this.cache.block.get(child_id) as IPage,
      async (id, _, container) =>
        container.push(new Page({ ...this.getProps(), id }))
    );
  }

  /**
   * Create multiple new columns in the collection schema
   * @param args array of Schema creation properties
   * @returns An array of SchemaUnit objects representing the columns
   */
  async createSchemaUnits(args: TSchemaUnitInput[]) {
    const data = this.getCachedData(),
      schema_unit_map = NotionCore.CreateMaps.schemaUnit(),
      props = this.getProps();
    await NotionFabricator.CreateData.schema(
      args,
      {
        name: data.name,
        parent_collection_id: data.id,
        current_schema: data.schema
      },
      this.getProps(),
      (schema_unit) =>
        PopulateMap.schemaUnit(
          this.id,
          schema_unit.schema_id,
          schema_unit,
          props,
          schema_unit_map
        )
    );
    await NotionOperations.executeOperations(
      [
        NotionOperations.Chunk.collection.update(
          this.id,
          ['schema'],
          data.schema
        )
      ],
      this.getProps()
    );
    return schema_unit_map;
  }

  async getSchemaUnit(arg?: FilterType<ISchemaMapValue>) {
    return await this.getSchemaUnits(transformToMultiple(arg), false);
  }

  /**
   * Return multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async getSchemaUnits(
    args?: FilterTypes<ISchemaMapValue>,
    multiple?: boolean
  ) {
    // Since all the data is in the cache, no need to initialize cache
    const data = this.getCachedData(),
      schema_map = NotionUtils.generateSchemaMap(data.schema);
    return await this.getIterate<ISchemaMapValue, ISchemaUnitMap>(
      args,
      {
        container: NotionCore.CreateMaps.schemaUnit(),
        child_ids: Array.from(schema_map.keys()),
        child_type: 'collection',
        multiple,
        initialize_cache: false
      },
      (name) => schema_map.get(name),
      (_, schema_unit, schema_unit_map) =>
        PopulateMap.schemaUnit(
          this.id,
          schema_unit.schema_id,
          schema_unit,
          this.getProps(),
          schema_unit_map
        )
    );
  }

  /**
   * Update and return a single column from the collection schema
   * @param args schema_id string and schema properties tuple
   * @returns A SchemaUnit object representing the column
   */
  async updateSchemaUnit(
    arg: UpdateType<ISchemaMapValue, Partial<TSchemaUnit>>
  ) {
    return await this.updateSchemaUnits(transformToMultiple(arg), false);
  }

  /**
   * Update and return multiple columns from the collection schema
   * @param args schema_id string and schema properties array of tuples
   * @returns An array of SchemaUnit objects representing the columns
   */
  async updateSchemaUnits(
    args: UpdateTypes<ISchemaMapValue, Partial<TSchemaUnit>>,
    multiple?: boolean
  ) {
    const data = this.getCachedData(),
      schema_map = NotionUtils.generateSchemaMap(data.schema);
    const results = await this.updateIterate<
      ISchemaMapValue,
      Partial<TSchemaUnit>,
      ISchemaUnitMap
    >(
      args,
      {
        child_ids: Array.from(schema_map.keys()),
        child_type: 'collection',
        multiple,
        manual: true,
        container: NotionCore.CreateMaps.schemaUnit(),
        initialize_cache: false
      },
      (name) => schema_map.get(name),
      (_, schema_unit, updated_data, schema_unit_map) => {
        data.schema[schema_unit.schema_id] = NotionUtils.deepMerge(
          data.schema[schema_unit.schema_id],
          updated_data
        );
        PopulateMap.schemaUnit(
          this.id,
          schema_unit.schema_id,
          data.schema[schema_unit.schema_id],
          this.getProps(),
          schema_unit_map
        );
      }
    );
    await NotionOperations.executeOperations(
      [
        NotionOperations.Chunk.collection.update(
          this.id,
          ['schema'],
          data.schema
        )
      ],
      this.getProps()
    );
    return results;
  }

  /**
   * Delete a single column from the collection schema
   * @param args schema_id string or predicate function
   * @returns A SchemaUnit object representing the column
   */
  async deleteSchemaUnit(args?: FilterType<ISchemaMapValue>) {
    return await this.deleteSchemaUnits(transformToMultiple(args), false);
  }

  /**
   * Delete multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async deleteSchemaUnits(
    args?: FilterTypes<ISchemaMapValue>,
    multiple?: boolean
  ) {
    const data = this.getCachedData(),
      schema_map = NotionUtils.generateSchemaMap(data.schema);
    const deleted_schema_unit_map = await this.deleteIterate<
      ISchemaMapValue,
      ISchemaUnitMap
    >(
      args,
      {
        child_ids: Array.from(schema_map.keys()),
        child_type: 'collection',
        multiple,
        manual: true,
        container: NotionCore.CreateMaps.schemaUnit(),
        initialize_cache: false
      },
      (name) => schema_map.get(name),
      (_, schema_unit, schema_unit_map) => {
        if (schema_unit.schema_id === 'title')
          NotionLogger.error(`Title schema unit cannot be deleted`);
        delete data.schema[schema_unit.schema_id];
        PopulateMap.schemaUnit(
          this.id,
          schema_unit.schema_id,
          schema_unit,
          this.getProps(),
          schema_unit_map
        );
      }
    );
    await NotionOperations.executeOperations(
      [
        NotionOperations.Chunk.collection.update(
          this.id,
          ['schema'],
          data.schema
        )
      ],
      this.getProps()
    );
    return deleted_schema_unit_map;
  }
}

export default Collection;
