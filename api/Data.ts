import { v4 as uuidv4 } from 'uuid';

import { Schema, NishanArg, TDataType, TData, IOperation, Args, BlockRepostionArg, TBlock, TParentType, ICollection, ISpace, ISpaceView, IUserRoot, UpdateCacheManuallyParam, CreateRootCollectionViewPageParams, INotionUser, IPermission, TPermissionRole, TRootPage, FilterTypes } from "../types";
import { Operation, error, createViews } from "../utils";
import Getters from "./Getters";

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */

export default class Data<T extends TData> extends Getters {
  id: string;
  type: TDataType;
  listBeforeOp: (path: string[], args: Args) => IOperation;
  listAfterOp: (path: string[], args: Args) => IOperation;
  updateOp: (path: string[], args: Args) => IOperation;
  setOp: (path: string[], args: Args) => IOperation;
  listRemoveOp: (path: string[], args: Args) => IOperation;
  child_path: keyof T = "" as any;
  child_type: TDataType = "block" as any;
  init_cache: boolean;
  init_child_data: boolean;

  constructor(arg: NishanArg & { type: TDataType }) {
    super(arg);
    this.type = arg.type;
    this.id = arg.id;
    this.listBeforeOp = Operation[arg.type].listBefore.bind(this, this.id);
    this.listAfterOp = Operation[arg.type].listAfter.bind(this, this.id);
    this.updateOp = Operation[arg.type].update.bind(this, this.id)
    this.setOp = Operation[arg.type].set.bind(this, this.id)
    this.listRemoveOp = Operation[arg.type].listRemove.bind(this, this.id);
    this.init_cache = false;
    this.init_child_data = false;
  }

  initializeChildData() {
    if (!this.init_child_data) {
      if (this.type === "block") {
        const data = this.getCachedData() as TBlock;
        if (data.type === "page")
          this.child_path = "content" as any
        else if (data.type === "collection_view" || data.type === "collection_view_page") {
          this.child_path = "view_ids" as any
          this.child_type = "collection_view"
        }
      } else if (this.type === "space")
        this.child_path = "pages" as any;
      else if (this.type === "user_root") {
        this.child_path = "space_views" as any;
        this.child_type = "space_view"
      }
      else if (this.type === "collection")
        this.child_path = "template_pages" as any;
      else if (this.type === "space_view")
        this.child_path = "bookmarked_pages" as any;
      this.init_child_data = true;
    }
  }

  /**
   * Get the parent of the current data
   */
  getParent() {
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
  deleteCachedData() {
    this.cache[this.type].delete(this.id);
  }

  /**
   * Adds the passed block id in the child container array of parent
   * @param $block_id id of the block to add
   * @param arg 
   * @returns created Operation and a function to update the cache and the class data
   */
  addToChildArray(child_id: string, position: number | BlockRepostionArg | undefined) {
    const data = this.getCachedData();
    if (!data[this.child_path]) data[this.child_path] = [] as any;

    const container: string[] = data[this.child_path] as any;

    let where: "before" | "after" = "before", id: string = '';

    if (position !== undefined) {
      if (typeof position === "number") {
        id = container?.[position] ?? '';
        where = container.indexOf(child_id) > position ? "before" : "after";
        container.splice(position, 0, child_id);
      } else {
        where = position.position, id = position.id;
        container.splice(container.indexOf(position.id) + (position.position === "before" ? -1 : 1), 0, child_id);
      }

      return (Operation[this.type] as any)[`list${where.charAt(0).toUpperCase() + where.substr(1)}`](this.id, [this.child_path as string], {
        [where]: id,
        id: child_id
      }) as IOperation
    } else {
      container.push(child_id);
      return Operation[this.type].listAfter(this.id, [this.child_path as string], {
        after: '',
        id: child_id
      }) as IOperation;
    }
  }

  /**
   * Update the cache of the data using only the passed keys
   * @param arg 
   * @param keys 
   */
  updateCacheLocally(arg: Partial<T>, keys: (keyof T)[]) {
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
    if (!this.init_cache) {
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
        container = (this.getCachedData() as ISpace).pages ?? [];
      } else if (this.type === "user_root")
        container = (this.getCachedData() as IUserRoot).space_views.map((space_view => [space_view, "space_view"])) ?? []
      else if (this.type === "collection")
        container = (this.getCachedData() as ICollection).template_pages ?? []
      else if (this.type === "space_view")
        container = (this.getCachedData() as ISpaceView).bookmarked_pages ?? []

      const non_cached: UpdateCacheManuallyParam = container.filter(info =>
        !Boolean(Array.isArray(info) ? this.cache[info[1]].get(info[0]) : this.cache.block.get(info))
      );

      if (non_cached.length !== 0)
        await this.updateCacheManually(non_cached);

      this.init_cache = true;
    }
  }

  protected async traverseChildren<Q extends TData>(arg: FilterTypes<Q>, multiple: boolean = true, cb: (block: Q, should_add: boolean) => Promise<void>) {
    await this.initializeCache();
    await this.initializeChildData();
    const matched: Q[] = [];
    const data = this.getCachedData(), container: string[] = data[this.child_path] as any ?? [];

    if (Array.isArray(arg)) {
      for (let index = 0; index < arg.length; index++) {
        const block_id = arg[index], block = this.cache[this.child_type].get(block_id) as Q;
        const should_add = container.includes(block_id);
        if (should_add) {
          matched.push(block)
          await cb(block, should_add);
        }
        if (!multiple && matched.length === 1) break;
      }
    } else if (typeof arg === "function" || arg === undefined) {
      for (let index = 0; index < container.length; index++) {
        const block_id = container[index], block = this.cache[this.child_type].get(block_id) as Q;
        const should_add = typeof arg === "function" ? await arg(block, index) : true;
        if (should_add) {
          matched.push(block)
          await cb(block, should_add);
        }
        if (!multiple && matched.length === 1) break;
      }
    }
    return matched;
  }

  protected async getItems<Q extends TData>(arg: FilterTypes<Q>, multiple: boolean = true, cb: (Q: Q) => Promise<any>) {
    const blocks: any[] = [];
    await this.traverseChildren<Q>(arg, multiple, async function (block, matched) {
      if (matched) blocks.push(await cb(block))
    })
    return blocks;
  }

  protected async deleteItems<Q extends TData>(arg: FilterTypes<Q>, multiple: boolean = true,) {
    const ops: IOperation[] = [], current_time = Date.now(), _this = this;
    const blocks = await this.traverseChildren(arg, multiple, async function (block, matched) {
      if (matched) {
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
      await this.saveTransactions(ops);
      blocks.forEach(blocks => this.cache.block.delete(blocks.id));
    }
  }



  createCollection(option: Partial<CreateRootCollectionViewPageParams>, parent_id: string) {
    const { properties, format } = option;

    if (!option.views) option.views = [{
      aggregations: [
        ['title', 'count']
      ],
      name: 'Default View',
      type: 'table'
    }];

    if (!option.schema) option.schema = [
      ['Name', 'title']
    ];
    const schema: Schema = {};

    option.schema.forEach(opt => {
      const schema_key = (opt[1] === "title" ? "Title" : opt[0]).toLowerCase().replace(/\s/g, '_');
      schema[schema_key] = {
        name: opt[0],
        type: opt[1],
        ...(opt[2] ?? {})
      } as any;
      /* if (schema[schema_key].options) schema[schema_key].options = (schema[schema_key] as any).options.map(([value, color]: [string, string]) => ({
        id: uuidv4(),
        value,
        color
      })) */
    });

    const views = option.views.map((view) => ({
      ...view,
      id: uuidv4()
    }));

    return { schema, views: createViews(views, parent_id), properties, format }
  }

  /**
     * Share page to users with specific permissions
     * @param args array of userid and role of user to share pages to
     */
  protected async addSharedUsers(args: [string, TPermissionRole][]) {
    const data = this.getCachedData() as TRootPage, notion_users: INotionUser[] = [];
    const permissionItems: IPermission[] = [];
    for (let i = 0; i < args.length; i++) {
      const [email, permission] = args[i];
      const notion_user = await this.findUser(email);
      if (!notion_user) throw new Error(error(`User does not have a notion account`));
      else
        permissionItems.push({
          role: permission,
          type: "user_permission",
          user_id: notion_user.id
        });
      notion_users.push(notion_user)
    }
    await this.inviteGuestsToSpace({
      blockId: data.id,
      permissionItems,
      spaceId: data.space_id
    });
    await this.updateCacheManually([this.id, [data.space_id, "space"]]);
    return notion_users;
  }

  /**
   * Share the current page with the user
   * @param email email of the user to add
   * @param role Role of the added user
   */
  protected async addSharedUser(email: string, role: TPermissionRole) {
    return (await this.addSharedUsers([[email, role]]))?.[0]
  }

  /**
   * Update the role of the current user based on their id
   * @param id Id of the user to update
   * @param role new Role of the user to update
   */
  protected async updateSharedUser(id: string, role: TPermissionRole) {
    return await this.updateSharedUsers([[id, role]]);
  }

  /**
   * Update the role of the current users based on their id
   * @param args array of array [id of the user, role type for the user]
   */
  protected async updateSharedUsers(args: [string, TPermissionRole][]) {
    const data = this.getCachedData() as TRootPage, ops: IOperation[] = [];
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      ops.push({
        args: { role: arg[1], type: "user_permission", user_id: arg[0] },
        command: "setPermissionItem",
        id: this.id,
        path: ["permissions"],
        table: "block"
      })
    }
    ops.push(this.updateOp(["last_edited_time"], Date.now()));
    await this.saveTransactions(ops);
    await this.updateCacheManually([data.id, [data.space_id, "space"]]);
  }

  /**
   * Remove a single user from the pages permission option
   * @param id Id of the user to remove from permission
   */
  protected async removeSharedUser(id: string) {
    return await this.removeSharedUsers([id]);
  }

  /**
   * Remove multiple users from the pages permission option
   * @param id array of the users id to remove from permission
   */
  protected async removeSharedUsers(ids: string[]) {
    return await this.updateSharedUsers(ids.map(id => [id, "none"]));
  }
}