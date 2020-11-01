import { v4 as uuidv4 } from 'uuid';

import { ISpace } from "../types/api";
import { IPage, IRootPage, TBlock, TParentType } from "../types/block";
import { BlockRepostionArg, CreateRootCollectionViewPageParams } from "../types/function";
import { NishanArg, TDataType, TData, Operation, Args, Schema, } from "../types/types";
import { blockListAfter, blockListBefore, blockListRemove, blockSet, blockUpdate, notionUserListAfter, notionUserListBefore, notionUserListRemove, notionUserSet, notionUserUpdate, spaceListAfter, spaceListBefore, spaceListRemove, spaceSet, spaceUpdate, spaceViewListAfter, spaceViewListBefore, spaceViewListRemove, spaceViewSet, spaceViewUpdate, userSettingsListAfter, userSettingsListBefore, userSettingsListRemove, userSettingsSet, userSettingsUpdate } from "../utils/chunk";
import { error } from "../utils/logs";
import Getters from "./Getters";

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */
export default class Data<T extends TData> extends Getters {
  id: string;
  type: TDataType;
  listBeforeOp: (path: string[], args: Args) => Operation;
  listAfterOp: (path: string[], args: Args) => Operation;
  updateOp: (path: string[], args: Args) => Operation;
  setOp: (path: string[], args: Args) => Operation;
  listRemoveOp: (path: string[], args: Args) => Operation;

  constructor(arg: NishanArg) {
    super(arg);
    this.type = arg.type;
    this.id = arg.id;
    const data = this.cache[this.type].get(this.id) as T;
    switch (this.type) {
      case "space":
        this.listBeforeOp = spaceListBefore.bind(this, data.id);
        this.listAfterOp = spaceListAfter.bind(this, data.id);
        this.updateOp = spaceUpdate.bind(this, data.id);
        this.setOp = spaceSet.bind(this, data.id);
        this.listRemoveOp = spaceListRemove.bind(this, data.id);
        break;
      case "block":
        this.listBeforeOp = blockListBefore.bind(this, data.id);
        this.listAfterOp = blockListAfter.bind(this, data.id);
        this.updateOp = blockUpdate.bind(this, data.id);
        this.setOp = blockSet.bind(this, data.id);
        this.listRemoveOp = blockListRemove.bind(this, data.id);
        break;
      case "space_view":
        this.listBeforeOp = spaceViewListBefore.bind(this, data.id);
        this.listAfterOp = spaceViewListAfter.bind(this, data.id);
        this.updateOp = spaceViewUpdate.bind(this, data.id);
        this.setOp = spaceViewSet.bind(this, data.id);
        this.listRemoveOp = spaceViewListRemove.bind(this, data.id);
        break;
      case "user_settings":
        this.listBeforeOp = userSettingsListBefore.bind(this, data.id);
        this.listAfterOp = userSettingsListAfter.bind(this, data.id);
        this.updateOp = userSettingsUpdate.bind(this, data.id);
        this.setOp = userSettingsSet.bind(this, data.id);
        this.listRemoveOp = userSettingsListRemove.bind(this, data.id);
        break;
      case "notion_user":
        this.listBeforeOp = notionUserListBefore.bind(this, data.id);
        this.listAfterOp = notionUserListAfter.bind(this, data.id);
        this.updateOp = notionUserUpdate.bind(this, data.id);
        this.setOp = notionUserSet.bind(this, data.id);
        this.listRemoveOp = notionUserListRemove.bind(this, data.id);
        break;
      default:
        this.listBeforeOp = blockListBefore.bind(this, data.id);
        this.listAfterOp = blockListAfter.bind(this, data.id);
        this.updateOp = blockUpdate.bind(this, data.id);
        this.setOp = blockSet.bind(this, data.id);
        this.listRemoveOp = blockListRemove.bind(this, data.id);
        break;
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
    else if (data === undefined)
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
  protected addToChildArray($block_id: string, arg: number | BlockRepostionArg | undefined): [Operation, (() => void)] {
    const cached_data = this.type === "space" ? this.cache.space.get(this.id) as ISpace : this.cache.block.get(this.id) as IPage | IRootPage;
    const cached_container = this.type === "space" ? (cached_data as ISpace).pages : (cached_data as IPage).content;
    const path = this.type === "space" ? "pages" : "content";
    if (cached_container) {
      let block_list_after_op = this.listAfterOp([path], {
        after: '',
        id: $block_id
      });

      if (arg !== undefined) {
        if (typeof arg === "number") {
          const block_id_at_pos = (cached_data as any)?.[path]?.[arg] ?? '';
          block_list_after_op = this.listBeforeOp([path], {
            before: block_id_at_pos,
            id: $block_id
          });
        } else
          block_list_after_op = arg.position === "after" ? this.listAfterOp([path], {
            after: arg.id,
            id: $block_id
          }) : this.listBeforeOp([path], {
            after: arg.id,
            id: $block_id
          })
      }

      return [block_list_after_op, function () {
        if (arg === undefined)
          cached_container.push($block_id);
        else {
          if (typeof arg === "number")
            cached_container.splice(arg, 0, $block_id);
          else {
            const target_index = cached_container.indexOf(arg.id);
            cached_container.splice(target_index + (arg.position === "before" ? -1 : 1), 0, $block_id);
          }
        }
      }];

    } else
      throw new Error("The data does not contain children")
  }

  protected async addToCachedData(type: TDataType, id: string) {
    const { recordMap } = await this.syncRecordValues([{
      table: type,
      id,
      version: 0
    }]);

    this.cache[type].set(id, recordMap[type][id].value as any);
  }
  /**
   * Update the cache of the data using only the passed keys
   * @param arg 
   * @param keys 
   */
  protected updateCacheLocally(arg: Partial<T>, keys: (keyof T)[]) {
    const _this = this;
    const cached_data = this.getCachedData();
    const data = arg as T;

    keys.forEach(key => {
      data[key] = arg[key] ?? (_this as any).data[key]
    });

    (data as any).last_edited_time = Date.now();

    return [this.updateOp(this.type === "user_settings" ? ["settings"] : [], data), function () {
      keys.forEach(key => {
        cached_data[key] = data[key];
        (_this as any).data[key] = data[key];
      })
    }] as [Operation, (() => void)];
  }

  protected parseCollectionOptions(option: Partial<CreateRootCollectionViewPageParams>) {
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

    if (option.schema)
      option.schema.forEach(opt => {
        const schema_key = (opt[1] === "title" ? "Title" : opt[0]).toLowerCase().replace(/\s/g, '_');
        schema[schema_key] = {
          name: opt[0],
          type: opt[1],
          ...(opt[2] ?? {})
        };
        if (schema[schema_key].options) schema[schema_key].options = (schema[schema_key] as any).options.map(([value, color]: [string, string]) => ({
          id: uuidv4(),
          value,
          color
        }))
      });

    const views = (option.views && option.views.map((view) => ({
      ...view,
      id: uuidv4()
    }))) || [];

    return { schema, views, properties, format }

  }
}