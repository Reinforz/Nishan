import { v4 as uuidv4 } from 'uuid';
import { Schema, NishanArg, TDataType, TData, IOperation, Args, RepositionParams, TBlock, TParentType, ICollection, ISpace, ISpaceView, IUserRoot, UpdateCacheManuallyParam, FilterTypes, TViewFilters, ViewAggregations, ViewFormatProperties, ViewSorts, ISchemaUnit, ICollectionBlockInput, TSearchManipViewParam, TableSearchManipViewParam, ITableViewFormat, BoardSearchManipViewParam, IBoardViewFormat, GallerySearchManipViewParam, IGalleryViewFormat, CalendarSearchManipViewParam, ICalendarViewQuery2, ITimelineViewFormat, TimelineSearchManipViewParam, TViewType, ITBlock, ITView, ITSchemaUnit, TOperationTable, CreateBlockArg, IDriveInput, ITCollectionBlock, PageCreateContentParam, RecordMap, TGenericEmbedBlockType, WebBookmarkProps, SetBookmarkMetadataParams, ICollectionView, TBlockType, TView, UpdateTypes, TSubjectType, TSchemaUnit } from "../types";
import { validateUUID, Operation, error, warn } from "../utils";
import Operations from "./Operations";

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */

export default class Data<T extends TData> extends Operations {
  id: string;
  type: TDataType;
  protected listBeforeOp: (path: string[], args: Args) => IOperation;
  protected listAfterOp: (path: string[], args: Args) => IOperation;
  protected updateOp: (path: string[], args: Args) => IOperation;
  protected setOp: (path: string[], args: Args) => IOperation;
  protected listRemoveOp: (path: string[], args: Args) => IOperation;
  protected child_path: keyof T = "" as any;
  protected child_type: TDataType = "block" as any;
  #init_cache: boolean = false;
  #init_child_data: boolean;

  constructor(arg: NishanArg & { type: TDataType }) {
    super(arg);
    this.type = arg.type;
    this.id = arg.id;
    this.listBeforeOp = Operation[arg.type].listBefore.bind(this, this.id);
    this.listAfterOp = Operation[arg.type].listAfter.bind(this, this.id);
    this.updateOp = Operation[arg.type].update.bind(this, this.id)
    this.setOp = Operation[arg.type].set.bind(this, this.id)
    this.listRemoveOp = Operation[arg.type].listRemove.bind(this, this.id);
    this.#init_cache = false;
    this.#init_child_data = false;
  }

  #detectChildData = (type: TDataType, id: string) => {
    let child_type: TDataType = 'block', child_path: string = '';
    const data = this.cache[type].get(id) as TBlock;
    if (type === "block") {
      if (data.type === "page")
        child_path = "content" as any
      else if (data.type === "collection_view" || data.type === "collection_view_page") {
        child_path = "view_ids" as any
        child_type = "collection_view"
      }
    } else if (type === "space")
      child_path = "pages" as any;
    else if (type === "user_root") {
      child_path = "space_views" as any;
      child_type = "space_view"
    }
    else if (type === "collection")
      child_path = "template_pages" as any;
    else if (type === "space_view")
      child_path = "bookmarked_pages" as any;

    return [child_path, child_type] as [string, TDataType]
  }

  protected initializeChildData() {
    if (!this.#init_child_data) {
      const [child_path, child_type] = this.#detectChildData(this.type, this.id);
      this.child_path = child_path as any;
      this.child_type = child_type as any;
      this.#init_child_data = true;
    }
  }

  /**
   * Get the parent of the current data
   */
  protected getParent() {
    const data = this.getCachedData() as TBlock;
    if (this.type.match(/(space|block|collection)/) && data?.parent_id) {
      const parent = this.cache.block.get(data.parent_id) as TParentType;
      if (!parent) throw new Error(error(`Block with id ${data.id} doesnot have a parent`));
      return parent;
    } else
      throw new Error(error(`Block with id ${data.id} doesnot have a parent`));
  }

  /**
   * Get the cached data using the current data id
   */
  getCachedData<Q extends TData = T>(arg?: string, type?: TDataType) {
    type = type ? type : "block";
    let id = this.id;
    if (typeof arg === "string") id = arg;
    const data = this.cache[arg ? type : this.type].get(id) as Q;
    if (data) return data;
    else if ((data as any).alive === false)
      throw new Error(error("Data has been deleted"));
    else
      throw new Error(error("Data not available in cache"))
  }

  /**
   * Delete the cached data using the id
   */
  protected deleteCachedData() {
    this.cache[this.type].delete(this.id);
  }

  /**
   * Adds the passed block id in the child container array of parent
   * @param $block_id id of the block to add
   * @param arg
   * @returns created Operation and a function to update the cache and the class data
   */
  protected addToChildArray(child_id: string, position: RepositionParams) {
    const data = this.getCachedData();
    this.initializeChildData();

    if (!data[this.child_path]) data[this.child_path] = [] as any;

    const container: string[] = data[this.child_path] as any;

    return this.#addToChildArrayUtil({ child_id, position, container, child_path: this.child_path as string, parent_id: this.id, parent_type: this.type })
  }

  #addToChildArrayUtil = (arg: { child_id: string, position: RepositionParams, container: string[], child_path: string, parent_type: TOperationTable, parent_id: string }) => {
    const { child_id, position, container, child_path, parent_type, parent_id } = arg;
    if (position !== undefined) {
      let where: "before" | "after" = "before", id: string = '';
      if (typeof position === "number") {
        id = container?.[position] ?? '';
        where = container.indexOf(child_id) > position ? "before" : "after";
        container.splice(position, 0, child_id);
      } else {
        where = position.position, id = position.id;
        container.splice(container.indexOf(position.id) + (position.position === "before" ? -1 : 1), 0, child_id);
      }

      return (Operation[parent_type] as any)[`list${where.charAt(0).toUpperCase() + where.substr(1)}`](parent_id, [child_path], {
        [where]: id,
        id: child_id
      }) as IOperation
    } else {
      container.push(child_id);
      return Operation[parent_type].listAfter(parent_id, [child_path], {
        after: '',
        id: child_id
      }) as IOperation;
    }
  }

  protected addToParentChildArray(child_id: string, position: RepositionParams) {
    const data = this.getCachedData() as any, parent = (this.cache as any)[data.parent_table].get(data.parent_id),
      child_path = this.#detectChildData(data.parent_table, parent.id)[0], container: string[] = parent[child_path] as any;

    return this.#addToChildArrayUtil({ child_id, position, container, child_path, parent_id: data.parent_id, parent_type: data.parent_table })
  }

  /**
   * Update the cache of the data using only the passed keys
   * @param arg
   * @param keys
   */
  protected updateCacheLocally(arg: Partial<T>, keys: (keyof T)[]) {
    const _this = this;
    const parent_data = this.getCachedData();
    const data = arg as T;

    keys.forEach(key => {
      data[key] = arg[key] ?? (_this as any).data[key]
    });

    (data as any).last_edited_time = Date.now();

    return [this.updateOp(this.type === "user_settings" ? ["settings"] : [], data), function () {
      keys.forEach(key => {
        parent_data[key] = data[key];
        (_this as any).data[key] = data[key];
      })
    }] as [IOperation, (() => void)];
  }

  protected async initializeCache() {
    if (!this.#init_cache) {
      let container: UpdateCacheManuallyParam = []
      if (this.type === "block") {
        const data = this.getCachedData() as TBlock;
        if (data.type === "page")
          container = data.content ?? [];
        if (data.type === "collection_view" || data.type === "collection_view_page") {
          container = data.view_ids.map((view_id) => [view_id, "collection_view"]) ?? []
          container.push([data.collection_id, "collection"])
        }
      } else if (this.type === "space") {
        const space = this.getCachedData() as ISpace;
        container = space.pages ?? [];
        space.permissions.forEach((permission) => container.push([permission.user_id, "notion_user"]))
      } else if (this.type === "user_root")
        container = (this.getCachedData() as IUserRoot).space_views.map((space_view => [space_view, "space_view"])) ?? []
      else if (this.type === "collection") {
        container = (this.getCachedData() as ICollection).template_pages ?? []
        await this.queryCollection({
          collectionId: this.id,
          collectionViewId: "",
          query: {},
          loader: {
            type: "table",
            loadContentCover: true
          }
        })
      }
      else if (this.type === "space_view")
        container = (this.getCachedData() as ISpaceView).bookmarked_pages ?? []

      const non_cached: UpdateCacheManuallyParam = container.filter(info =>
        !Boolean(Array.isArray(info) ? this.cache[info[1]].get(info[0]) : this.cache.block.get(info))
      );

      if (non_cached.length !== 0)
        await this.updateCacheManually(non_cached);

      this.#init_cache = true;
    }
  }

  protected async traverseChildren<Q extends TData>(arg: FilterTypes<Q>, multiple: boolean = true, cb: (block: Q, should_add: boolean) => Promise<void>, condition?: (Q: Q) => boolean) {
    await this.initializeCache();
    this.initializeChildData();

    const matched: Q[] = [];
    const data = this.getCachedData(), container: string[] = data[this.child_path] as any ?? [];

    if (Array.isArray(arg)) {
      for (let index = 0; index < arg.length; index++) {
        const block_id = arg[index], block = this.cache[this.child_type].get(block_id) as Q;
        const should_add = block && container.includes(block_id);
        if (should_add) {
          matched.push(block)
          await cb(block, should_add);
        }
        if (!multiple && matched.length === 1) break;
      }
    } else if (typeof arg === "function" || arg === undefined) {
      for (let index = 0; index < container.length; index++) {
        const block_id = container[index], block = this.cache[this.child_type].get(block_id) as Q;
        const should_add = block && (condition ? condition(block) : true) && (typeof arg === "function" ? await arg(block, index) : true);
        if (should_add) {
          matched.push(block)
          await cb(block, should_add);
        }
        if (!multiple && matched.length === 1) break;
      }
    }
    return matched;
  }

  protected async getItems<Q extends TData>(arg: FilterTypes<Q>, multiple: boolean = true, cb: (Q: Q) => Promise<any>, condition?: (Q: Q) => boolean) {
    const blocks: any[] = [];
    await this.traverseChildren<Q>(arg, multiple, async function (block, matched) {
      if (matched) blocks.push(await cb(block))
    }, condition ?? (() => true))
    return blocks;
  }

  protected async deleteItems<Q extends TData>(arg: FilterTypes<Q>, execute?: boolean, multiple?: boolean) {
    const ops: IOperation[] = [], current_time = Date.now(), sync_records: UpdateCacheManuallyParam = [], _this = this;
    await this.traverseChildren(arg, multiple, async function (block, matched) {
      if (matched) {
        sync_records.push(block.id);
        ops.push(Operation[_this.child_type as TDataType].update(block.id, [], {
          alive: false,
          last_edited_time: current_time
        }),
          _this.listRemoveOp([_this.child_path as string], { id: block.id })
        )
      }
    })

    if (ops.length !== 0) {
      ops.push(this.setOp(["last_edited_time"], current_time));
      sync_records.push(this.id);
    }

    await this.executeUtil(ops, sync_records, execute)
  }

  protected async deleteCustomItems<C extends TData>(items: string[], child_type: TSubjectType, args?: FilterTypes<C>, execute?: boolean, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.initializeCache();
    const ops: IOperation[] = [], sync_records: UpdateCacheManuallyParam = [];

    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const block_id = args[index], should_add = items.includes(block_id);
        if (should_add) {
          ops.push(Operation.block.update(block_id, [], {
            alive: false,
            last_edited_time: Date.now()
          }))
          sync_records.push(block_id);
          this.logger && this.logger("DELETE", child_type, block_id)
        }
        if (!multiple && sync_records.length === 1) break;
      }
    } else if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < items.length; index++) {
        const block_id = items[index],
          block = this.cache.block.get(block_id) as C;
        const should_add = typeof args === "function" ? await args(block, index) : true;
        if (should_add) {
          ops.push(Operation.block.update(block_id, [], {
            alive: false,
            last_edited_time: Date.now()
          }))
          sync_records.push(block_id);
          this.logger && this.logger("DELETE", child_type, block_id)
        }
        if (!multiple && sync_records.length === 1) break;
      }
    }

    await this.executeUtil(ops, sync_records, execute)
  }

  async getCustomItems<T extends (TData | TSchemaUnit)>(items: string[], child_type: TSubjectType, transformer: (id: string) => T, args?: FilterTypes<T>, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.initializeCache();
    const block_ids: string[] = [];

    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const block_id = args[index], should_add = items.includes(block_id);
        if (should_add) {
          block_ids.push(block_id);
          this.logger && this.logger("READ", child_type, block_id)
        }
        if (!multiple && block_ids.length === 1) break;
      }
    } else if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < items.length; index++) {
        const block_id = items[index], should_add = typeof args === "function" ? await args(transformer(block_id), index) : true;
        if (should_add) {
          block_ids.push(block_id);
          this.logger && this.logger("READ", child_type, block_id)
        }
        if (!multiple && block_ids.length === 1) break;
      }
    }
    return block_ids;
  }

  async updateItems<T1 extends TData, T2>(args: UpdateTypes<T1, T2>, items: string[], child_type: TSubjectType, execute?: boolean, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.initializeCache();
    const ops: IOperation[] = [], sync_records: UpdateCacheManuallyParam = [], current_time = Date.now(), block_ids: string[] = [];
    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const [id, block] = args[index];
        block_ids.push(id);
        if (items.includes(id)) {
          ops.push(Operation.block.update(id, [], { ...block, last_edited_time: current_time }));
          sync_records.push(id);
          this.logger && this.logger("UPDATE", child_type, id);
          if (block_ids.length === 1 && multiple) break;
        }
      }
    }
    else if (typeof args === "function") {
      for (let index = 0; index < items.length; index++) {
        const block_id = items[index], block = this.cache.block.get(block_id) as T1, updated_value = await args(block, index);
        block_ids.push(block_id)
        if (updated_value) {
          ops.push(Operation.block.update(block_id, [], { ...block, ...updated_value, last_edited_time: current_time, last_edited_by: this.user_id }));
          sync_records.push(block_id);
          this.logger && this.logger("UPDATE", child_type, block_id);
          if (block_ids.length === 1 && multiple) break;
        }
      }
    }
    await this.executeUtil(ops, block_ids, execute);
    return block_ids;
  }

  protected createViewsUtils(schema: Schema, views: TSearchManipViewParam[], collection_id: string, parent_id: string) {
    const name_map: Map<string, { key: string } & ISchemaUnit> = new Map(), created_view_ops: IOperation[] = [], view_infos: [string, TViewType][] = [];

    Object.entries(schema).forEach(([key, schema]) => name_map.set(schema.name, { key, ...schema }));

    for (let index = 0; index < views.length; index++) {
      const { id, name, type, view, filter_operator = "and" } = views[index],
        sorts = [] as ViewSorts[], filters = [] as TViewFilters[], aggregations = [] as ViewAggregations[], properties = [] as ViewFormatProperties[],
        view_id = this.generateId(id), included_units: string[] = [], query2 = {
          sort: sorts,
          filter: {
            operator: filter_operator,
            filters
          },
          aggregations
        } as any, format = {
          [`${type}_properties`]: properties
        } as any;

      view_infos.push([view_id, type]);

      switch (type) {
        case "table":
          const table_view = views[index] as TableSearchManipViewParam, table_format = format as ITableViewFormat;
          table_format.table_wrap = table_view.table_wrap ?? true;
          break;
        case "board":
          const board_view = views[index] as BoardSearchManipViewParam, board_format = format as IBoardViewFormat;
          board_format.board_cover = board_view.board_cover ?? { type: "page_cover" };
          board_format.board_cover_aspect = board_view.board_cover_aspect;
          board_format.board_cover_size = board_view.board_cover_size;
          board_format.board_groups2 = board_view.board_groups2 as any;
          break;
        case "gallery":
          const gallery_view = views[index] as GallerySearchManipViewParam, gallery_format = format as IGalleryViewFormat;
          if (gallery_view.gallery_cover?.type === "property") gallery_format.gallery_cover = { ...gallery_view.gallery_cover, property: name_map.get(gallery_view.gallery_cover.property)?.key as string }
          else gallery_format.gallery_cover = gallery_view.gallery_cover
          gallery_format.gallery_cover_aspect = gallery_view.gallery_cover_aspect
          gallery_format.gallery_cover_size = gallery_view.gallery_cover_size
          break;
        case "calendar":
          const calender_view = views[index] as CalendarSearchManipViewParam, calendar_query2 = query2 as ICalendarViewQuery2;
          calendar_query2.calendar_by = calender_view.calendar_by;
          break;
        case "timeline":
          const timeline_view = views[index] as TimelineSearchManipViewParam, timeline_format = format as ITimelineViewFormat;
          timeline_format.timeline_preference = timeline_view.timeline_preference ?? { centerTimestamp: 1, zoomLevel: "month" }
          timeline_format.timeline_show_table = timeline_view.timeline_show_table ?? true;
          break;
      }

      view.forEach(info => {
        const { format, sort, aggregation, filter, name } = info, property_info = name_map.get(name);
        if (property_info) {
          const { key } = property_info,
            property: ViewFormatProperties = {
              property: key,
              visible: true,
              width: 250
            };
          included_units.push(key);
          if (typeof format === "boolean") property.visible = format;
          else if (typeof format === "number") property.width = format;
          else if (Array.isArray(format)) {
            property.width = format?.[1] ?? 250
            property.visible = format?.[0] ?? true;
          }
          if (sort) {
            if (Array.isArray(sort))
              sorts.splice(sort[1], 0, {
                property: key,
                direction: sort[0]
              })
            else sorts.push({
              property: key,
              direction: sort
            })
          }

          if (aggregation) aggregations.push({
            property: key,
            aggregator: aggregation
          })

          if (filter) {
            filter.forEach(([operator, type, value, position]: any) => {
              const filter_value = {
                property: key,
                filter: {
                  operator,
                  value: {
                    type,
                    value
                  }
                } as any
              }
              if (position) filters.splice(position, 0, filter_value)
              else filters.push(filter_value)
            })
          }
          properties.push(property)
        } else
          throw new Error(error(`Collection:${collection_id} does not contain SchemeUnit.name:${name}`))
      })

      const non_included_units = Object.keys(schema).filter(key => !included_units.includes(key));

      non_included_units.forEach(property => {
        properties.push({
          property,
          visible: false
        })
      })

      created_view_ops.push(Operation.collection_view.set(view_id, [], {
        id: view_id,
        version: 0,
        type,
        name,
        page_sort: [],
        parent_id,
        parent_table: 'block',
        alive: true,
        format,
        query2,
      }))
    }

    return [created_view_ops, view_infos] as [IOperation[], [string, TViewType][]];
  }

  protected createCollection(param: ICollectionBlockInput, parent_id: string) {
    const schema: Schema = {}, collection_id = this.generateId(param.id);

    param.schema.forEach(opt => {
      schema[(opt.name === "title" ? "Title" : opt.name).toLowerCase().replace(/\s/g, '_')] = opt
    });

    const [created_view_ops, view_infos] = this.createViewsUtils(schema, param.views, collection_id, parent_id);
    created_view_ops.unshift(Operation.collection.update(collection_id, [], {
      id: collection_id,
      schema,
      format: {
        collection_page_properties: []
      },
      icon: param?.format?.page_icon ?? "",
      parent_id,
      parent_table: 'block',
      alive: true,
      name: param.properties.title
    }));

    return [collection_id, created_view_ops, view_infos] as [string, IOperation[], [string, TViewType][]]
  }

  protected createBlockMap = () => {
    return {
      linked_db: [],
      collection_view_page: [],
      embed: [],
      video: [],
      audio: [],
      image: [],
      bookmark: [],
      code: [],
      file: [],
      tweet: [],
      gist: [],
      codepen: [],
      maps: [],
      figma: [],
      drive: [],
      text: [],
      table_of_contents: [],
      equation: [],
      breadcrumb: [],
      factory: [],
      page: [],
      to_do: [],
      header: [],
      sub_header: [],
      sub_sub_header: [],
      bulleted_list: [],
      numbered_list: [],
      toggle: [],
      quote: [],
      divider: [],
      callout: [],
      collection_view: [],
      link_to_page: [],
      column_list: [],
      column: []
    } as ITBlock
  }

  protected createViewMap() {
    return {
      board: [],
      gallery: [],
      list: [],
      timeline: [],
      table: [],
      calendar: [],
    } as ITView;
  }

  protected createSchemaUnitMap() {
    return {
      text: [],
      number: [],
      select: [],
      multi_select: [],
      title: [],
      date: [],
      person: [],
      file: [],
      checkbox: [],
      url: [],
      email: [],
      phone_number: [],
      formula: [],
      relation: [],
      rollup: [],
      created_time: [],
      created_by: [],
      last_edited_time: [],
      last_edited_by: []
    } as ITSchemaUnit
  }

  protected async createClass(type: TBlockType, id: string): Promise<any> {
    const Page = require("./Page").default;
    const Block = require("./Block").default;
    const CollectionView = require("./CollectionView").default;
    const CollectionViewPage = require('./CollectionViewPage').default;
    const Collection = require("./Collection").default;
    const { TableView, ListView, GalleryView, BoardView, CalendarView, TimelineView } = require("./View/index");
    const view_classes = { table: TableView, list: ListView, gallery: GalleryView, board: BoardView, calendar: CalendarView, timeline: TimelineView };

    const obj = {
      id,
      ...this.getProps()
    };

    switch (type) {
      case "video":
      case "audio":
      case "image":
      case "bookmark":
      case "code":
      case "file":
      case "tweet":
      case "gist":
      case "codepen":
      case "maps":
      case "figma":
      case "drive":
      case "text":
      case "table_of_contents":
      case "equation":
      case "breadcrumb":
      case "factory":
      case "to_do":
      case "header":
      case "sub_header":
      case "sub_sub_header":
      case "bulleted_list":
      case "numbered_list":
      case "toggle":
      case "quote":
      case "divider":
      case "callout":
        return new Block(obj);
      case "page":
        return new Page(obj);
      case "collection_view":
      case "collection_view_page":
        const cv = this.cache.block.get(id) as ICollectionView;
        await this.updateCacheIfNotPresent([[cv.collection_id, "collection"], ...cv.view_ids.map(view_id => [view_id, "collection_view"] as [string, keyof RecordMap])])
        const data = {
          block: type === "collection_view" ? new CollectionView(obj) : new CollectionViewPage(obj),
          collection: new Collection({ ...obj, id: cv.collection_id }),
          views: this.createViewMap()
        }
        cv.view_ids.forEach((view_id) => {
          const view = this.cache.collection_view.get(view_id) as TView;
          data.views[view.type].push(new view_classes[view.type]({ ...obj, id: view_id }) as any)
        })

        return data;
      default:
        return new Page(obj);
    }
  }

  generateId(id: string | undefined) {
    return id ? validateUUID(id) ? id : warn("Invalid uuid provided") && uuidv4() : uuidv4()
  }

  async nestedContentPopulate(contents: PageCreateContentParam[], parent_id: string, parent_table: TDataType) {
    const ops: IOperation[] = [], bookmarks: SetBookmarkMetadataParams[] = [], sync_records: UpdateCacheManuallyParam = [], block_map = this.createBlockMap();

    const { TableView, ListView, GalleryView, BoardView, CalendarView, TimelineView } = require("./View/index");
    const CollectionView = require("./CollectionView").default;
    const CollectionViewPage = require('./CollectionViewPage').default;
    const Collection = require('./Collection').default;
    const Block = require('./Block').default;

    const view_classes = { table: TableView, list: ListView, gallery: GalleryView, board: BoardView, calendar: CalendarView, timeline: TimelineView };

    const traverse = async (contents: PageCreateContentParam[], parent_id: string, parent_table: TDataType, parent_content_id?: string) => {
      parent_content_id = parent_content_id ?? parent_id;
      for (let index = 0; index < contents.length; index++) {
        const content = contents[index], $block_id = this.generateId(content.id);
        sync_records.push($block_id);
        content.type = content.type ?? 'page';

        if (content.type.match(/gist|codepen|tweet|maps|figma/)) {
          content.format = (await this.getGenericEmbedBlockData({
            pageWidth: 500,
            source: (content.properties as any).source[0][0] as string,
            type: content.type as TGenericEmbedBlockType
          })).format;
        };

        const {
          format,
          properties,
          type,
        } = content;

        if (type === "bookmark") {
          bookmarks.push({
            blockId: $block_id,
            url: (properties as WebBookmarkProps).link[0][0]
          })
          await this.setBookmarkMetadata({
            blockId: $block_id,
            url: (properties as WebBookmarkProps).link[0][0]
          });
        }

        else if (type === "drive") {
          const {
            accounts
          } = await this.getGoogleDriveAccounts();
          await this.initializeGoogleDriveBlock({
            blockId: $block_id,
            fileId: (content as IDriveInput).file_id as string,
            token: accounts[0].token
          });
        }

        if (content.type === "collection_view_page" || content.type === "collection_view") {
          const [collection_id, create_view_ops, view_infos] = this.createCollection(content as ICollectionBlockInput, $block_id);
          const args: any = {
            id: $block_id,
            type,
            collection_id,
            view_ids: view_infos.map(view_info => view_info[0]),
            properties,
            format,
            parent_id,
            parent_table,
            alive: true,
          };

          if (content.type === "collection_view_page") args.permissions = [{ type: content.isPrivate ? 'user_permission' : 'space_permission', role: 'editor', user_id: this.user_id }],
            ops.push(Operation.block.update($block_id, [], args),
              ...create_view_ops,
            )

          const collectionblock_map: ITCollectionBlock = {
            block: type === "collection_view" ? new CollectionView({
              ...this.getProps(),
              id: $block_id
            }) : new CollectionViewPage({
              ...this.getProps(),
              id: $block_id
            }),
            collection: new Collection({
              id: collection_id,
              ...this.getProps()
            }),
            views: this.createViewMap()
          }

          view_infos.map(([view_id, view_type]) => collectionblock_map.views[view_type].push(new view_classes[view_type]({
            ...this.getProps(),
            id: view_id
          }) as any))

          sync_records.push([collection_id, "collection"], ...view_infos.map(view_info => [view_info[0], "collection_view"] as [string, TDataType]))
          block_map[type].push(collectionblock_map as any);
          if (content.rows)
            await traverse(content.rows as any, collection_id, "collection")
        } else if (content.type === "factory") {
          const factory_contents_map = this.createBlockMap(), content_ids: string[] = [], content_blocks_ops = (content.contents.map(content => ({
            ...content,
            $block_id: this.generateId(content.id)
          })) as CreateBlockArg[]).map(content => {
            factory_contents_map[content.type].push(this.createClass(content.type, content.$block_id) as any)
            sync_records.push(content.$block_id)
            content_ids.push(content.$block_id);
            return Operation.block.update(content.$block_id, [], { ...content, parent_id: $block_id, alive: true, parent_table: "block" })
          });
          ops.push(
            Operation.block.update($block_id, [], {
              id: $block_id,
              properties,
              format,
              type,
              parent_id,
              parent_table,
              alive: true,
              content: content_ids
            }),
            ...content_blocks_ops
          );
          block_map.factory.push({
            block: new Block({
              id: $block_id,
              ...this.getProps()
            }), contents: factory_contents_map
          })
        }
        else if (content.type === "linked_db") {
          const { collection_id, views } = content,
            collection = this.cache.collection.get(collection_id) as ICollection,
            [created_view_ops, view_infos] = this.createViewsUtils(collection.schema, views, collection.id, $block_id);

          ops.push(Operation.block.set($block_id, [], {
            id: $block_id,
            version: 1,
            type: 'collection_view',
            collection_id,
            view_ids: view_infos.map(view_info => view_info[0]),
            parent_id,
            parent_table,
            alive: true,
          }),
            ...created_view_ops);
          sync_records.push([collection_id, "collection"], ...view_infos.map(view_info => [view_info[0], "collection_view"] as [string, keyof RecordMap]));
          const collectionblock_map: ITCollectionBlock = {
            block: new CollectionView({
              ...this.getProps(),
              id: $block_id
            }),
            collection: new Collection({
              id: collection_id,
              ...this.getProps()
            }),
            views: this.createViewMap()
          }

          view_infos.map(([view_id, view_type]) => collectionblock_map.views[view_type].push(new view_classes[view_type]({
            ...this.getProps(),
            id: view_id
          }) as any))

          block_map[content.type].push(collectionblock_map)
        }
        else if (content.type === "page") {
          if (content.contents)
            await traverse(content.contents, $block_id, "block");
          ops.push(Operation.block.update($block_id, [], {
            is_template: (content as any).is_template && parent_table === "collection",
            id: $block_id,
            properties,
            format,
            type,
            parent_id,
            parent_table,
            alive: true,
            permissions: [{ type: content.isPrivate ? 'user_permission' : 'space_permission', role: 'editor', user_id: this.user_id }],
          }))
          block_map[type].push(await this.createClass(content.type, $block_id));
        }
        else if (content.type === "column_list") {
          const { contents } = content;
          ops.push(Operation.block.set($block_id, [], {
            id: $block_id,
            parent_id,
            parent_table,
            alive: true,
            version: 1,
            type: "column_list",
          }));

          for (let index = 0; index < contents.length; index++) {
            const column_id = uuidv4();
            ops.push(Operation.block.set(column_id, [], {
              id: column_id,
              parent_id: $block_id,
              parent_table: "block",
              alive: true,
              type: "column",
              version: 1,
              format: {
                column_ratio: 1 / contents.length
              }
            }), Operation.block.listAfter($block_id, ['content'], { after: '', id: column_id }));
            sync_records.push(column_id);
            await traverse([contents[index]], this.id, "block", column_id)
          }
        }
        else if (content.type !== "link_to_page") {
          ops.push(Operation.block.update($block_id, [], {
            id: $block_id,
            properties,
            format,
            type,
            parent_id,
            parent_table,
            alive: true,
          }));
          block_map[type].push(await this.createClass(content.type, $block_id));
        }

        const content_id = content.type === "link_to_page" ? content.page_id : $block_id;

        if (parent_table === "block")
          ops.push(Operation.block.listAfter(parent_content_id, ['content'], { after: '', id: content_id }))
        else if (parent_table === "space")
          ops.push(Operation.space.listAfter(parent_content_id, ['pages'], { after: '', id: content_id }))
        else if (parent_table === "collection" && (content as any).is_template)
          ops.push(Operation.collection.listAfter(parent_content_id, ['template_pages'], { after: '', id: content_id }))
      }
    }

    await traverse(contents, parent_id, parent_table);
    return [ops, sync_records, block_map, { bookmarks }] as [IOperation[], UpdateCacheManuallyParam, ITBlock, { bookmarks: SetBookmarkMetadataParams[] }]
  }

}