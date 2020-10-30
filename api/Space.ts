import { v4 as uuidv4 } from 'uuid';

import Data from './Data';
import SpaceView from './SpaceView';
import NotionUser from './NotionUser';
import UserSettings from './UserSettings';
import RootPage from "./RootPage";
import RootCollectionViewPage from './RootCollectionViewPage';

import { blockUpdate, collectionUpdate } from '../utils/chunk';
import { error } from '../utils/logs';

import { NishanArg, Operation, Predicate, TPage, TRootPage } from '../types/types';
import { ISpace, ISpaceView } from '../types/api';
import { IRootPage, IPageInput, IRootCollectionViewPage } from '../types/block';
import { CreateRootCollectionViewPageParams, CreateRootPageArgs, SpaceUpdateParam } from '../types/function';
import createViews from '../utils/createViews';

/**
 * A class to represent space of Notion
 * @noInheritDoc
 */
class Space extends Data<ISpace> {
  constructor(arg: NishanArg<ISpace>) {
    super(arg);
    this.data = arg.data;
  }

  /**
   * Get the current logged in notion user
   * @returns The NotionUser object attached with the token
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
   * @returns Returns the logged in UserSettings object
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
   * Get pages from this space
   * @param arg criteria to filter pages by
   * @returns An array of pages object matching the passed criteria
   */
  async getPages(arg: undefined | string[] | Predicate<TRootPage>, multiple: boolean = true) {
    const pages: (RootPage | RootCollectionViewPage)[] = [];
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
                new RootCollectionViewPage({
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
   * Get a single page from this space
   * @param arg criteria to filter pages by
   * @returns A page object matching the passed criteria
   */
  async getPage(arg: string | Predicate<TPage>) {
    if (typeof arg === "string") return (await this.getPages([arg], true))[0];
    else return (await this.getPages(arg, true))[0];
  }

  async createRootCollectionViewPage(option: CreateRootCollectionViewPageParams) {
    return (await this.createRootCollectionViewPages([option], false))[0];
  }

  // ? FEAT:1:H Return newly created Collection,CollectionViewPage and all ViewIds
  async createRootCollectionViewPages(options: CreateRootCollectionViewPageParams[], multiple: boolean = true) {
    if (this.data) {
      const ops: Operation[] = [], block_ids: string[] = [];
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        const { properties, format, schema, views } = this.parseCollectionOptions(option)

        const view_ids = views.map((view) => view.id);
        const $collection_id = uuidv4();
        const block_id = uuidv4();
        block_ids.push(block_id);
        const [block_update_op, update] = this.addToChildArray(block_id, option.position);

        ops.push(blockUpdate(block_id, [], {
          type: 'page',
          id: block_id,
          permissions:
            [{ type: option.isPrivate ? 'user_permission' : 'space_permission', role: 'editor', user_id: this.user_id }],
          parent_id: this.space_id,
          parent_table: 'space',
          alive: true,
          properties,
          format,
        }),
          blockUpdate(block_id, [], {
            type: 'collection_view_page',
            collection_id: $collection_id,
            view_ids,
            properties: {},
          }),
          collectionUpdate($collection_id, [], {
            id: $collection_id,
            schema,
            format: {
              collection_page_properties: []
            },
            parent_id: block_id,
            parent_table: 'block',
            alive: true,
            name: properties?.title
          }),
          block_update_op,
          ...createViews(views, block_id));
        update();
        if (!multiple && ops.length === 1) break;
      }

      await this.saveTransactions(ops);
      const {
        block
      } = await this.loadUserContent();

      return block_ids.map(block_id => new RootCollectionViewPage({
        type: "block",
        ...this.getProps(),
        data: block[block_id].value as IRootCollectionViewPage
      }))
    } else throw new Error(error('This space has been deleted'));
  }

  // ? FEAT:1:M Batch rootpage creation
  /**
   * Create a new page using passed properties and formats
   * @param opts format and properties for the root page
   * @return Newly created Root page object
   */
  async createRootPage(opts: CreateRootPageArgs) {
    const [page] = await this.createRootPages([opts]);
    return page;
  }

  // ? RF:1:E Capture multiple ops in an array and use one saveTransactions
  /**
   * Create new pages using passed properties and formats
   * @param opts array of format and properties for the root pages
   * @returns An array of newly created rootpage block objects
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
  /**
   * Delete multiple root_pages or root_collection_view_pages
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteRootPages(arg: string[] | Predicate<IRootCollectionViewPage | IRootPage>, multiple: boolean = true) {
    if (this.data) {
      const current_time = Date.now();
      const ops: Operation[] = [];
      const is_array = Array.isArray(arg);

      for (let index = 0; index < this.data.pages.length; index++) {
        const id = this.data.pages[index];
        const page = this.cache.block.get(id) as IRootPage | IRootCollectionViewPage;
        const should_delete = is_array ? (arg as string[]).includes(id) : typeof arg === "function" ? await arg(page, index) : false;
        if (should_delete)
          ops.push(blockUpdate(id, [], {
            alive: false,
            last_edited_time: current_time
          }), this.listRemoveOp(['pages'], { id }), this.setOp(['last_edited_time'], current_time));
        if (!multiple && ops.length === 1) break;
      }
      await this.saveTransactions(ops);
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteRootPage(arg: string | Predicate<IRootCollectionViewPage | IRootPage>): Promise<void> {
    if (typeof arg === "string") return await this.deleteRootPages([arg], false);
    else if (typeof arg === "function") return await this.deleteRootPages(arg, false);
  }

  // ? FEAT:1:H Update cache and class state
  /**
   * Update multiple root pages located in the space
   * @param arg Array of tuple, id and object to configure each root page
   * @param multiple whether multiple rootpages should be deleted
   */
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
        if (!multiple && ops.length === 1) break;
      }
      await this.saveTransactions(ops);
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Update a singular root page in the space
   * @param id id of the root page to update
   * @param opt object to configure root page
   */
  async updateRootPage(id: string, opt: Omit<IPageInput, "type">) {
    await this.updateRootPages([[id, opt]], false);
  }

  // ? FEAT:1:M Update space permissions
  /**
   * Update the space settings
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
  /**
   * Remove multiple users from the current space
   * @param userIds ids of the user to remove from the workspace
   */
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

  /**
   * Get the space view associated with the space
   * @returns The associated space view object
   */
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
