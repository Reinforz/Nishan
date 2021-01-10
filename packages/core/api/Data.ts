import { TDataType, TData, Args, IOperation, TBlock, TOperationTable, ISpace, IUserRoot, ICollection, ISpaceView, SetBookmarkMetadataParams, TGenericEmbedBlockType, WebBookmarkProps } from '@nishans/types';
import { TSubjectType, TMethodType, NishanArg, RepositionParams, UpdateCacheManuallyParam, FilterTypes, UpdateTypes, ITBlock, TBlockCreateInput, IDriveInput } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Operation, warn, createViews, createCollection, createBlockMap, generateId, createBlockClass } from "../utils";
import Operations from "./Operations";

interface CommonIterateOptions<T> {
  child_ids: string[] | keyof T,
  subject_type: TSubjectType,
  multiple?: boolean
}

interface UpdateIterateOptions<T> extends CommonIterateOptions<T> { child_type?: TDataType, execute?: boolean, updateParent?: boolean };
interface DeleteIterateOptions<T> extends UpdateIterateOptions<T> {
  child_path?: keyof T
}

interface IterateOptions<T> {
  method: TMethodType,
  subject_type: TSubjectType,
  child_ids: string[] | keyof T,
  multiple?: boolean
}

interface GetIterateOptions<T> extends CommonIterateOptions<T> {
  method?: TMethodType,
}

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
  #init_cache = false;
  #init_child_data = false;

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

  protected getLastEditedProps() {
    return { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by: this.user_id }
  }

  #detectChildData = (type: TDataType, id: string) => {
    let child_type: TDataType = 'block', child_path = '';
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
   * Get the cached data using the current data id
   */
  getCachedData() {
    const data = this.cache[this.type].get(this.id);
    if ((data as any).alive === false)
      warn(`${this.type}:${this.id} has been deleted`);
    return data as T;
  }

  /**
   * Delete the cached data using the id
   */
  protected deleteCachedData() {
    this.cache[this.type].delete(this.id);
  }

  async updateCachedData(){
    await this.updateCacheManually([[this.id, this.type]])
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
      let where: "before" | "after" = "before", id = '';
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
  updateCacheLocally(arg: Partial<T>, keys: ReadonlyArray<(keyof T)>) {
    const parent_data = this.getCachedData(), data = arg as T;

    const update = () =>{
      Object.entries(arg).forEach(([key, value])=>{
        if(keys.includes(key as keyof T))
          parent_data[key as keyof T] = value;
      })
    }

    return [this.updateOp(this.type === "user_settings" ? ["settings"] : [], data), update] as [IOperation, (() => void)]
  }

  protected async initializeCache() {
    if (!this.#init_cache) {

      const container: UpdateCacheManuallyParam = []
      if (this.type === "block") {
        const data = this.getCachedData() as TBlock;
        if (data.type === "page")
          container.push(...data.content);
        if (data.type === "collection_view" || data.type === "collection_view_page") {
          data.view_ids.map((view_id) => container.push([view_id, "collection_view"]))
          container.push([data.collection_id, "collection"])
        }
      } else if (this.type === "space") {
        const space = this.getCachedData() as ISpace;
        container.push(...space.pages);
        space.permissions.forEach((permission) => container.push([permission.user_id, "notion_user"]))
      } else if (this.type === "user_root")
        (this.getCachedData() as IUserRoot).space_views.map((space_view => container.push([space_view, "space_view"]))) ?? []
      else if (this.type === "collection") {
        container.push(...((this.getCachedData() as ICollection).template_pages ?? []))
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
        container.push(...(this.getCachedData() as ISpaceView).bookmarked_pages ?? [])

      const non_cached: UpdateCacheManuallyParam = container.filter(info =>
        !Boolean(Array.isArray(info) ? this.cache[info[1]].get(info[0]) : this.cache.block.get(info))
      );

      if (non_cached.length !== 0)
        await this.updateCacheManually(non_cached);

      this.#init_cache = true;
    }
  }

  // cb1 is passed from the various iterate methods, cb2 is passed from the actual method
  #iterate = async<TD, RD = TD>(args: FilterTypes<TD> | UpdateTypes<TD, RD>, transform: ((id: string) => TD | undefined), options: IterateOptions<T>, cb1?: (id: string, data: TD, updated_data: RD | undefined, index: number) => any, cb2?: ((id: string, data: TD, updated_data: RD, index: number) => any)) => {
    await this.initializeCache();
    const matched_ids: TD[] = [], { multiple = true, method, subject_type } = options;
    const child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : this.getCachedData()[options.child_ids]) ?? []) as string[];

    const iterateUtil = async (child_id: string, child_data: TD, updated_data: RD | undefined, index: number) => {
      cb1 && await cb1(child_id, child_data, updated_data, index);
      cb2 && await cb2(child_id, child_data, updated_data as any, index);
      this.logger && this.logger(method, subject_type, child_id);
      matched_ids.push(child_data);
    }

    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const arg = args[index];
        if (Array.isArray(arg)) {
          const [child_id, updated_data] = arg, child_data = transform(child_id), matches = child_ids.includes(child_id);
          if (!child_data) warn(`Child:${child_id} does not exist in the cache`);
          else if (!matches) warn(`Child:${child_id} is not a child of ${this.type}:${this.id}`);
          if (child_data && matches)
            await iterateUtil(child_id, child_data, updated_data, index)
        } else if (typeof arg === "string") {
          const child_id = arg, child_data = transform(child_id), matches = child_ids.includes(child_id);
          if (!child_data) warn(`Child:${child_id} does not exist in the cache`);
          else if (!matches) warn(`Child:${child_id} is not a child of ${this.type}:${this.id}`);
          if (child_data && matches)
            await iterateUtil(child_id, child_data, undefined, index)
        }
        if (!multiple && matched_ids.length === 1) break;
      }
    } else {
      for (let index = 0; index < child_ids.length; index++) {
        const child_id = child_ids[index], child_data = transform(child_id);
        if (!child_data) warn(`Child:${child_id} does not exist in the cache`);
        else {
          const matches = args ? await args(child_data, index) : true;
          if (child_data && matches)
            await iterateUtil(child_id, child_data, matches as RD, index)
        }
        if (!multiple && matched_ids.length === 1) break;
      }
    }

    return matched_ids;
  }

  protected async deleteIterate<TD>(args: FilterTypes<TD>, options: DeleteIterateOptions<T>, transform: ((id: string) => TD | undefined), cb?: (id: string, data: TD) => void | Promise<any>) {
    const { child_type, child_path, execute = this.defaultExecutionState } = options, updated_props = this.getLastEditedProps();
    const ops: IOperation[] = [], sync_records: UpdateCacheManuallyParam = [];
    const matched_ids = await this.#iterate(args, transform, {
      method: "DELETE",
      ...options
    }, (child_id) => {
      if (child_type) {
        ops.push(Operation[child_type].update(child_id, [], { alive: false, ...updated_props }));
        sync_records.push([child_id, child_type])
        if (typeof child_path === "string") ops.push(this.listRemoveOp([child_path], { id: child_id }));
      }
    }, cb);
    if (ops.length !== 0) {
      ops.push(Operation[this.type].update(this.id, [], { ...updated_props }));
      sync_records.push([this.id, this.type]);
    }
    await this.executeUtil(ops, sync_records, execute);
    return matched_ids;
  }

  protected async updateIterate<TD, RD>(args: UpdateTypes<TD, RD>, options: UpdateIterateOptions<T>, transform: ((id: string) => TD | undefined), cb?: (id: string, data: TD, updated_data: RD, index: number) => any) {
    const { child_type, execute = this.defaultExecutionState, updateParent = true } = options, updated_props = this.getLastEditedProps();
    const matched_ids: string[] = [], ops: IOperation[] = [], sync_records: UpdateCacheManuallyParam = [];

    await this.#iterate(args, transform, {
      method: "UPDATE",
      ...options
    }, (child_id, _, updated_data) => {
      if (child_type) {
        ops.push(Operation[child_type].update(child_id, [], { ...updated_data, ...updated_props }));
        sync_records.push([child_id, child_type])
      }
    }, cb);

    if (ops.length !== 0 && updateParent) {
      ops.push(Operation[this.type].update(this.id, [], { ...updated_props }));
      sync_records.push([this.id, this.type]);
    }
    await this.executeUtil(ops, sync_records, execute);
    return matched_ids;
  }

  protected async getIterate<RD>(args: FilterTypes<RD>, options: GetIterateOptions<T>, transform: ((id: string) => RD | undefined), cb?: (id: string, data: RD) => void | Promise<any>) {
    return await this.#iterate<RD>(args, transform, {
      method: 'READ',
      ...options,
    }, undefined, cb);
  }

  protected getProps() {
    return {
      token: this.token,
      interval: this.interval,
      user_id: this.user_id,
      shard_id: this.shard_id,
      space_id: this.space_id,
      cache: this.cache,
      logger: this.logger,
      defaultExecutionState: this.defaultExecutionState,
      ...this.getStackSyncRecords()
    }
  }

  protected async nestedContentPopulateAndExecute(options: TBlockCreateInput[], execute?: boolean) {
    const [ops, sync_records, block_map, { bookmarks }] = await this.nestedContentPopulate(options, this.id, this.type);
    await this.executeUtil(ops, sync_records, execute);
    for (const bookmark of bookmarks)
      await this.setBookmarkMetadata(bookmark);
    return block_map;
  }

  protected async nestedContentPopulate(contents: TBlockCreateInput[], parent_id: string, parent_table: TDataType) {
    const ops: IOperation[] = [], bookmarks: SetBookmarkMetadataParams[] = [], sync_records: UpdateCacheManuallyParam = [], block_map = createBlockMap();

    const CollectionView = require("./CollectionView").default;
    const CollectionViewPage = require('./CollectionViewPage').default;
    const Block = require('./Block').default;

    const traverse = async (contents: TBlockCreateInput[], parent_id: string, parent_table: TDataType, parent_content_id?: string) => {
      parent_content_id = parent_content_id ?? parent_id;
      for (let index = 0; index < contents.length; index++) {
        const content = contents[index], $block_id = generateId(content.id);
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
          const [collection_id, create_view_ops, view_ids, , view_records] = createCollection(content, $block_id, this.getProps());
          const args: any = {
            id: $block_id,
            type,
            collection_id,
            view_ids,
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

          const collectionblock = type === "collection_view" ? new CollectionView({
            ...this.getProps(),
            id: $block_id
          }) : new CollectionViewPage({
            ...this.getProps(),
            id: $block_id
          });

          sync_records.push([collection_id, "collection"], ...view_records)
          block_map[type].push(collectionblock);
          if (content.rows)
            await traverse(content.rows as any, collection_id, "collection")
        } else if (content.type === "factory") {
          const factory_contents_map = createBlockMap(), content_ids: string[] = [], content_blocks_ops = (content.contents.map(content => ({
            ...content,
            $block_id: generateId(content.id)
          }))).map(content => {
            factory_contents_map[content.type].push(createBlockClass(content.type, content.$block_id, this.getProps()))
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
            [created_view_ops, view_ids, , view_records] = createViews(collection.schema, views, collection.id, $block_id, this.getProps());

          ops.push(Operation.block.set($block_id, [], {
            id: $block_id,
            version: 1,
            type: 'collection_view',
            collection_id,
            view_ids,
            parent_id,
            parent_table,
            alive: true,
          }),
            ...created_view_ops);
          sync_records.push([collection_id, "collection"], ...view_records);
          const collectionblock = new CollectionView({
            ...this.getProps(),
            id: $block_id
          })

          block_map[content.type].push(collectionblock)
        }
        else if (content.type === "page") {
          if (content.contents)
            await traverse(content.contents, $block_id, "block");
          const current_time = Date.now();
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
            created_time: current_time,
            created_by_id: this.user_id,
            created_by_table: 'notion_user',
            ...this.getLastEditedProps()
          }))
          block_map[type].push(createBlockClass(content.type, $block_id, this.getProps()));
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
          block_map[type].push(createBlockClass(content.type, $block_id, this.getProps()));
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