import { v4 as uuidv4 } from 'uuid';

import Getters from "./Getters";
import Page from "./Page";
import SpaceView from "./SpaceView";
import Block from './Block';
import Collection from './Collection';
import NotionUser from "./NotionUser";
import UserSettings from "./UserSettings";

import { spaceListBefore, blockUpdate, spaceUpdate } from '../utils/chunk';
import { error } from "../utils/logs";

import { NishanArg, Predicate } from "../types/types";
import { ISpace, ISpaceView } from '../types/api';
import { TBlock, IPage, PageProps, PageFormat, IRootPage } from '../types/block';


// ? FEAT:2 Add space related methods
class Space extends Getters {
  space_data: undefined | ISpace;

  constructor(arg: NishanArg & { space_data: ISpace }) {
    super(arg)
    this.space_data = arg.space_data;
  }

  async getNotionUser() {
    if (this.space_data) {
      const notion_user = this.cache.notion_user.get(this.user_id);
      if (notion_user) return new NotionUser({
        ...this.getProps(),
        notion_user
      })
    } else
      throw new Error(error("This space has been deleted"))
  }

  async getUserSettings() {
    if (this.space_data) {
      const user_settings = this.cache.user_settings.get(this.user_id);
      if (user_settings) return new UserSettings({
        ...this.getProps(),
        user_settings
      })
    } else
      throw new Error(error("This space has been deleted"))
  }

  /**
   * Return a new block by its id
   * @param block_id The id of the block to obtain
   */
  async getBlock(block_id: string): Promise<Block<TBlock>> {
    const cache_data = this.cache.block.get(block_id);
    if (cache_data) return new Block({ block_data: cache_data, ...this.getProps() });
    const { recordMap } = await this.getBacklinksForBlock(block_id);
    const target = recordMap.block[block_id];
    if (!target)
      throw new Error(error(`No block with the id ${block_id} exists`));
    if (!this.user_id || !this.space_id || !this.shard_id)
      throw new Error(error(`UserId, SpaceId or ShardId is null`));
    else
      return new Block({
        block_data: target.value,
        ...this.getProps()
      });
  }

  /**
   * Obtain a collection using its id
   * @param collection_id The id of the collection to obtain
   */
  async getCollection(collection_id: string) {
    const { recordMap: { collection } } = await this.syncRecordValues([
      {
        id: collection_id,
        table: 'collection',
        version: -1
      }
    ]);

    const collection_data = collection[collection_id].value;

    if (!this.user_id || !this.space_id || !this.shard_id)
      throw new Error(error(`UserId, SpaceId or ShardId is null`));
    else
      return new Collection({
        ...this.getProps(),
        collection_data
      });
  }

  async getPages(arg: undefined): Promise<Page[]>;
  async getPages(arg: undefined | string[] | Predicate<IPage>) {
    const pages: Page[] = [];
    if (this.space_data) {
      for (let i = 0; i < this.space_data.pages.length; i++) {
        const page_id = this.space_data.pages[i];
        let page = this.cache.block.get(page_id) as IPage;
        let should_add = false;
        if (arg === undefined)
          should_add = true;
        else if (Array.isArray(arg) && arg.includes(page_id))
          should_add = true;
        else if (typeof arg === "function")
          should_add = arg(page, i);
        if (should_add && page && (page as IPage).type === "page")
          pages.push(new Page({
            block_data: page,
            ...this.getProps()
          }))
      }
      return pages;
    } else
      throw new Error(error("This space has been deleted"))
  }
  /**
   * Obtain a page using the passed id
   * @param page_id Id of the page to obtain 
   */
  async getPage(page_id: string) {
    const cache_data = this.cache.block.get(page_id) as IPage;

    if (cache_data) return new Page({
      block_data: cache_data,
      ...this.getProps()
    });

    const { recordMap: { block } } = await this.getBacklinksForBlock(page_id);
    const target = block[page_id].value as IPage;

    if (!target)
      throw new Error(error(`No page with the id ${page_id} exists`));
    if (target.type !== "page")
      throw new Error(error(`The target block is not a page,but rather a ${target.type} type`));

    return new Page(
      {
        block_data: target,
        ...this.getProps()
      }
    );
  }

  /**
   * Create a new page using passed properties and formats
   * @param opts format and properties of the new page
   */
  async createRootPage(opts = {} as { properties: PageProps, format: PageFormat, isPrivate: boolean }) {
    const { properties = {}, format = {}, isPrivate = false } = opts;
    const $block_id = uuidv4();
    if (this.space_id && this.user_id) {
      await this.saveTransactions(
        [
          blockUpdate($block_id, [], {
            type: 'page', id: $block_id, version: 1, permissions: [{ type: isPrivate ? "user_permission" : 'space_permission', role: 'editor', user_id: this.user_id }], parent_id: this.space_id,
            parent_table: 'space',
            alive: true,
            properties,
            format,
            last_edited_time: Date.now(),
            last_edited_by_id: this.user_id,
            last_edited_by_table: 'notion_user',
            created_by_id: this.user_id,
            created_by_table: 'notion_user',
            created_time: Date.now(),
          }),
          spaceListBefore(this.space_id, ['pages'], { id: $block_id }),
        ]
      );

      const { recordMap } = await this.getBacklinksForBlock($block_id);

      return new Page({
        ...this.getProps(),
        block_data: recordMap.block[$block_id].value as IRootPage
      });
    } else
      throw new Error(error("Space and User id not provided"))
  }

  /**
   * Update the workspace settings
   * @param opt Properties of the space to update
   */
  async update(opt: Partial<Pick<ISpace, "name" | "beta_enabled" | "icon">>) {
    if (this.space_data) {
      const { name = this.space_data.name, beta_enabled = this.space_data.beta_enabled, icon = this.space_data.icon } = opt;
      const current_time = Date.now();
      await this.saveTransactions([
        spaceUpdate(this.space_data.id, [], {
          name,
          beta_enabled,
          icon,
          last_edited_time: current_time
        })
      ]);
      // ? RF:1:M Use a utility method to update the cache and internal class state
      const cached_data = this.cache.space.get(this.space_data.id);
      if (cached_data) {
        cached_data.icon = icon;
        cached_data.beta_enabled = beta_enabled;
        cached_data.last_edited_time = current_time;
        cached_data.name = name;
      }
      this.space_data.icon = icon;
      this.space_data.beta_enabled = beta_enabled;
      this.space_data.last_edited_time = current_time;
      this.space_data.name = name;
    } else
      throw new Error(error("This space has been deleted"))
  }

  /**
   * Delete the current workspace
   */
  async delete() {
    if (this.space_data) {
      await this.enqueueTask({
        eventName: "deleteSpace",
        request: {
          spaceId: this.space_data.id
        }
      })
      this.cache.space.delete(this.space_data.id);
    } else
      throw new Error(error("This space has been deleted"))

    this.space_data = undefined;
  }

  async getSpaceView() {
    let target_space_view: ISpaceView | null = null;
    for (let [, space_view] of this.cache.space_view) {
      if (this.space_data && space_view.space_id === this.space_data.id) {
        target_space_view = space_view;
        break;
      }
    }
    if (target_space_view) return new SpaceView({
      space_view_data: target_space_view,
      ...this.getProps()
    })
  }
}

export default Space;
