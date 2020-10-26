import { v4 as uuidv4 } from 'uuid';

import Data from './Data';
import Page from './Page';
import SpaceView from './SpaceView';
import Block from './Block';
import Collection from './Collection';
import NotionUser from './NotionUser';
import UserSettings from './UserSettings';

import { blockUpdate } from '../utils/chunk';
import { error } from '../utils/logs';

import { NishanArg, Predicate, TPage } from '../types/types';
import { ISpace, ISpaceView } from '../types/api';
import { TBlock, IRootPage, TBlockInput } from '../types/block';
import CollectionViewPage from './CollectionViewPage';
import { CreateRootPageArgs, SpaceUpdateParam } from '../types/function';

class Space extends Data<ISpace> {
  constructor(arg: NishanArg<ISpace>) {
    super(arg);
    this.data = arg.data;
  }

  /**
   * Get the current logged in notion user
   */
  async getNotionUser() {
    if (this.data) {
      const notion_user = this.cache.notion_user.get(this.user_id);
      if (notion_user)
        return new NotionUser({
          ...this.getProps(),
          data: notion_user,
          type: "notion_user"
        });
    } else throw new Error(error('This space has been deleted'));
  }

  /**
   * Get the current logged in user settings
   */
  async getUserSettings() {
    if (this.data) {
      const user_settings = this.cache.user_settings.get(this.user_id);
      if (user_settings)
        return new UserSettings({
          ...this.getProps(),
          data: user_settings,
          type: "user_settings"
        });
    } else throw new Error(error('This space has been deleted'));
  }

  /**
   * Return a block by its id 
   * @param block_id The id of the block to obtain
   */
  async getBlock(block_id: string): Promise<Block<TBlock, TBlockInput>> {
    const cache_data = this.cache.block.get(block_id);
    if (cache_data) return new Block({ data: cache_data, ...this.getProps(), type: "block" });
    const { recordMap } = await this.getBacklinksForBlock(block_id);
    const target = recordMap.block[block_id];
    if (!target) throw new Error(error(`No block with the id ${block_id} exists`));
    else
      return new Block({
        data: target.value,
        ...this.getProps(),
        type: "block"
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
    return new Collection({
      type: "collection",
      ...this.getProps(),
      data: collection_data
    });
  }

  /**
   * Get the pages of this space which matches a passed criteria
   * @param arg criteria to filter pages by
   */
  async getPages(arg: undefined | string[] | Predicate<TPage>, return_single: boolean = false) {
    const pages: (Page | CollectionViewPage)[] = [];
    if (this.data) {
      for (let i = 0; i < this.data.pages.length; i++) {
        const page_id = this.data.pages[i];
        let page = this.cache.block.get(page_id) as TPage;
        let should_add = false;
        if (arg === undefined) should_add = true;
        else if (Array.isArray(arg) && arg.includes(page_id)) should_add = true;
        else if (typeof arg === 'function') should_add = await arg(page, i);

        if (should_add && page) {
          switch (page.type) {
            case 'page':
              pages.push(
                new Page({
                  type: "block",
                  data: page,
                  ...this.getProps()
                })
              );
              break;
            case 'collection_view_page':
              pages.push(
                new CollectionViewPage({
                  type: "block",
                  data: page,
                  ...this.getProps()
                })
              );
              break;
          }

          if (pages.length === 1 && return_single) break;
        }
      }
      return return_single ? pages[0] : pages;
    } else throw new Error(error('This space has been deleted'));
  }

  /**
   * Get a single page of this space which matches a passed criteria
   * @param page_id Id of the page to obtain 
   */
  async getPage(arg: string | Predicate<TPage>) {
    if (typeof arg === "string") return this.getPages([arg], true);
    else return this.getPages(arg, true);
  }

  // ? FEAT:1:M Batch rootpage creation
  /**
   * Create a new page using passed properties and formats
   * @param opts format and properties for the root page
   */
  async createRootPage(opts: CreateRootPageArgs) {
    const [page] = await this.createRootPages([opts]);
    return page;
  }

  /**
   * Create new pages using passed properties and formats
   * @param opts array of format and properties for the root pages
   */
  async createRootPages(opts: CreateRootPageArgs[]) {
    if (this.data) {
      const block_ids: string[] = []
      for (let index = 0; index < opts.length; index++) {
        const opt = opts[index];
        const { position, properties = {}, format = {}, isPrivate = false } = opt;
        const $block_id = uuidv4();
        block_ids.push($block_id);
        const [block_list_op, update] = this.addToChildArray($block_id, position);
        await this.saveTransactions([
          blockUpdate($block_id, [], {
            type: 'page',
            id: $block_id,
            version: 1,
            permissions:
              [{ type: isPrivate ? 'user_permission' : 'space_permission', role: 'editor', user_id: this.user_id }],
            parent_id: this.space_id,
            parent_table: 'space',
            alive: true,
            properties,
            format,
            last_edited_time: Date.now(),
            last_edited_by_id: this.user_id,
            last_edited_by_table: 'notion_user',
            created_by_id: this.user_id,
            created_by_table: 'notion_user',
            created_time: Date.now()
          }),
          block_list_op
        ]);
        update();
      }

      const { block } = await this.loadUserContent();

      return block_ids.map(block_id => new Page({
        type: "block",
        ...this.getProps(),
        data: block[block_id].value as IRootPage
      }));
    } else throw new Error(error('This space has been deleted'));
  }

  // ? FEAT:1:M Update space permissions
  /**
   * Update the workspace settings
   * @param opt Properties of the space to update
   */
  async update(opt: SpaceUpdateParam) {
    if (this.data) {
      const [op, update] = this.updateCache(opt, ['icon',
        'beta_enabled',
        'last_edited_time',
        'name']);

      await this.saveTransactions([
        op
      ]);

      update();
    } else throw new Error(error('This space has been deleted'));
  }

  /**
   * Delete the current workspace
   */
  async delete() {
    if (this.data) {
      await this.enqueueTask({
        eventName: 'deleteSpace',
        request:
        {
          spaceId: this.data.id
        }
      });
      this.cache.space.delete(this.data.id);
    } else throw new Error(error('This space has been deleted'));
    this.deleteCompletely();
  }

  async getSpaceView() {
    let target_space_view: ISpaceView | null = null;
    for (let [, space_view] of this.cache.space_view) {
      if (this.data && space_view.space_id === this.data.id) {
        target_space_view = space_view;
        break;
      }
    }
    if (target_space_view)
      return new SpaceView({
        type: "space_view",
        data: target_space_view,
        ...this.getProps()
      });
  }
}

export default Space;
