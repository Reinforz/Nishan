import { v4 as uuidv4 } from 'uuid';

import Data from './Data';
import SpaceView from './SpaceView';
import Block from './Block';
import Collection from './Collection';
import NotionUser from './NotionUser';
import UserSettings from './UserSettings';
import RootPage from "./RootPage";

import { blockUpdate } from '../utils/chunk';
import { error } from '../utils/logs';

import { NishanArg, Operation, Predicate, TPage, TRootPage } from '../types/types';
import { ISpace, ISpaceView } from '../types/api';
import { TBlock, IRootPage, TBlockInput, IPage, IPageInput } from '../types/block';
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
  async getPages(arg: undefined | string[] | Predicate<TRootPage>, multiple: boolean = true) {
    const pages: (RootPage | CollectionViewPage)[] = [];
    if (this.data) {
      for (let i = 0; i < this.data.pages.length; i++) {
        const page_id = this.data.pages[i];
        let page = this.cache.block.get(page_id) as TRootPage;
        let should_add = false;
        if (arg === undefined) should_add = true;
        else if (Array.isArray(arg) && arg.includes(page_id)) should_add = true;
        else if (typeof arg === 'function') should_add = await arg(page, i);

        if (should_add && page) {
          switch (page.type) {
            case 'page':
              pages.push(
                new RootPage({
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

          if (pages.length === 1 && multiple) break;
        }
      }
      return pages;
    } else throw new Error(error('This space has been deleted'));
  }

  /**
   * Get a single page of this space which matches a passed criteria
   * @param page_id Id of the page to obtain 
   */
  async getPage(arg: string | Predicate<TPage>) {
    if (typeof arg === "string") return (await this.getPages([arg], true))[0];
    else return (await this.getPages(arg, true))[0];
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

      return block_ids.map(block_id => new RootPage({
        type: "block",
        ...this.getProps(),
        data: block[block_id].value as IRootPage
      }));
    } else throw new Error(error('This space has been deleted'));
  }

  // ? FIX:1:H Remove from normalized cache after root page deletion
  async deleteRootPages(arg: string[] | Predicate<IPage | IRootPage>, delete_multiple: boolean = true) {
    if (this.data) {
      const current_time = Date.now();
      const ops: Operation[] = [];
      const is_array = Array.isArray(arg);

      for (let index = 0; index < this.data.pages.length; index++) {
        const id = this.data.pages[index];
        const page = this.cache.block.get(id) as IPage;
        const should_delete = is_array ? (arg as string[]).includes(id) : typeof arg === "function" ? await arg(page, index) : false;
        if (should_delete)
          ops.push(blockUpdate(id, [], {
            alive: false,
            last_edited_time: current_time
          }), this.listRemoveOp(['pages'], { id }), this.setOp(['last_edited_time'], current_time));
        if (!delete_multiple && ops.length > 1) break;
      }
      await this.saveTransactions(ops);
    } else
      throw new Error(error('Data has been deleted'))
  }

  async deleteRootPage(arg: string | Predicate<IPage | IRootPage>): Promise<void> {
    if (typeof arg === "string") return await this.deleteRootPages([arg], false);
    else if (typeof arg === "function") return await this.deleteRootPages(arg, false);
  }

  // ? FEAT:1:H Update cache and class state
  async updateRootPages(arg: [string, Omit<IPageInput, "type">][], multiple: boolean = true) {
    if (this.data) {
      const ops: Operation[] = [];
      const current_time = Date.now();
      for (let index = 0; index < arg.length; index++) {
        const [id, opts] = arg[index];
        if (this.data.pages.includes(id))
          ops.push(blockUpdate(id, [], { ...opts, last_edited_time: current_time }))
        else
          throw new Error(error(`Space with id ${this.data.id} is not the parent of root page with id ${id}`));
        if (!multiple && ops.length > 1) break;
      }
      await this.saveTransactions(ops);
    } else
      throw new Error(error('Data has been deleted'))
  }

  async updateRootPage(id: string, opt: Omit<IPageInput, "type">) {
    await this.updateRootPages([[id, opt]], false);
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

  // ? FEAT:1:M Empty userids for all user, a predicate
  async removeUsers(userIds: string[]) {
    if (this.data) {
      await this.removeUsersFromSpace({
        removePagePermissions: true,
        revokeUserTokens: false,
        spaceId: this.data?.id,
        userIds
      });
    } else throw new Error(error('This space has been deleted'));
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
