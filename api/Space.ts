import { v4 as uuidv4 } from 'uuid';

import Data from './Data';
import RootPage from "./RootPage";
import RootCollectionViewPage from './RootCollectionViewPage';
import SpaceView from "./SpaceView";

import { Operation, error } from '../utils';

import { CreateRootCollectionViewPageParams, SpaceModifyParam, IPageInput, ISpace, ISpaceView, NishanArg, IOperation, TPage, TRootPage, UpdateCacheManuallyParam, IRootCollectionViewPage, IRootPage, FilterTypes, FilterType, TDataType, ICollection, RepositionParams } from '../types';
import CollectionViewPage from './CollectionViewPage';
import Collection from './Collection';

/**
 * A class to represent space of Notion
 * @noInheritDoc
 */
export default class Space extends Data<ISpace> {
  space_view?: ISpaceView;

  constructor(arg: NishanArg) {
    super({ ...arg, type: "space" });
  }

  get spaceView() {
    let target_space_view: ISpaceView | null = null;
    for (let [, space_view] of this.cache.space_view) {
      if (space_view.space_id === this.id) {
        target_space_view = space_view;
        break;
      }
    }
    return target_space_view;
  }

  /**
   * Get the space view associated with the space
   * @returns The associated space view object
   */
  getSpaceView() {
    const target_space_view = this.spaceView;
    if (target_space_view) {
      this.logger && this.logger("READ", "SpaceView", target_space_view.id)
      return new SpaceView({
        id: target_space_view.id,
        ...this.getProps()
      });
    }
  }

  // ? FEAT:1:M Update space permissions
  /**
   * Update the space settings
   * @param opt Properties of the space to update
   */
  async update(opt: SpaceModifyParam) {
    const [op, update] = this.updateCacheLocally(opt, ['icon', "disable_move_to_space", "disable_export", "disable_guests", "disable_public_access", "domain", "invite_link_enabled",
      'beta_enabled',
      'last_edited_time',
      'name']);

    await this.saveTransactions([
      op
    ]);
    this.logger && this.logger("UPDATE", "Space", this.id);
    update();
  }

  /**
   * Delete the current workspace
   */
  async delete() {
    await this.enqueueTask({
      eventName: 'deleteSpace',
      request:
      {
        spaceId: this.id
      }
    });
    this.logger && this.logger("DELETE", "Space", this.id);
    this.cache.space.delete(this.id);
  }

  async createTRootPage(option: ((CreateRootCollectionViewPageParams & { type: "collection_view_page" }) | (IPageInput & { position?: RepositionParams }))) {
    const troot_map = await this.createTRootPages([option]);
    return {
      collection_view_page: troot_map.collection_view_page[0],
      page: troot_map.page[0],
    }
  }

  async createTRootPages(options: ((CreateRootCollectionViewPageParams & { type: "collection_view_page" }) | (IPageInput & { position?: RepositionParams }))[]) {
    const ops: IOperation[] = [], trootpage_map: { collection_view_page: RootCollectionViewPage[], page: RootPage[] } = { collection_view_page: [], page: [] }, sync_records: UpdateCacheManuallyParam = [];
    for (let index = 0; index < options.length; index++) {
      const option = options[index],
        { type, properties, format, isPrivate, position } = option,
        block_id = uuidv4();

      if (type === "page") {
        const block_list_op = this.addToChildArray(block_id, position);
        sync_records.push(block_id);
        trootpage_map.page.push(new RootPage({
          id: block_id,
          ...this.getProps()
        }));
        ops.push(Operation.block.update(block_id, [], {
          type: 'page',
          id: block_id,
          version: 1,
          permissions:
            [{ type: isPrivate ? 'user_permission' : 'space_permission', role: 'editor', user_id: this.user_id }],
          parent_id: this.id,
          parent_table: 'space',
          alive: true,
          properties,
          format,
        }),
          block_list_op)
      } else if (type === "collection_view_page") {
        const [collection_id, create_view_ops, view_ids] = this.createCollection(option as CreateRootCollectionViewPageParams, block_id);
        ops.push(Operation.block.update(block_id, [], {
          type: 'page',
          id: block_id,
          permissions:
            [{ type: isPrivate ? 'user_permission' : 'space_permission', role: 'editor', user_id: this.user_id }],
          parent_id: this.id,
          parent_table: 'space',
          alive: true,
          properties,
          format,
        }),
          Operation.block.update(block_id, [], {
            type: 'collection_view_page',
            collection_id,
            view_ids,
            properties: {},
          }),
          ...create_view_ops,
          this.addToChildArray(block_id, option.position),
        );

        sync_records.push(block_id, [collection_id, "collection"], ...view_ids.map(view_id => [view_id, "collection_view"] as [string, TDataType]))
        trootpage_map.collection_view_page.push(new RootCollectionViewPage({
          ...this.getProps(),
          id: block_id
        }))
      }
    }

    await this.saveTransactions(ops);
    await this.updateCacheManually(sync_records);
    return trootpage_map;
  }

  async getRootPage(arg?: FilterType<IRootPage>): Promise<RootPage | undefined> {
    return (await this.getRootPages(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getRootPages(args?: FilterTypes<IRootPage>, multiple?: boolean): Promise<(RootPage | undefined)[]> {
    multiple = multiple ?? true;
    const props = this.getProps();
    return this.getItems<IRootPage>(args, multiple, async function (page) {
      return new RootPage({
        id: page.id,
        ...props
      })
    }, (page => page.type === "page"))
  }

  async getRootCollectionViewPage(arg?: FilterType<IRootCollectionViewPage>): Promise<RootCollectionViewPage | undefined> {
    return (await this.getRootCollectionViewPages(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getRootCollectionViewPages(args?: FilterTypes<IRootCollectionViewPage>, multiple?: boolean): Promise<(RootCollectionViewPage | undefined)[]> {
    multiple = multiple ?? true;
    const props = this.getProps();
    return this.getItems<IRootCollectionViewPage>(args, multiple, async function (page) {
      return new CollectionViewPage({
        id: page.id,
        ...props
      })
    }, (page) => page.type === "collection_view_page")
  }

  async getRootCollection(arg?: FilterType<ICollection>) {
    return (await this.getRootCollections(typeof arg === "string" ? [arg] : arg, true))[0]
  }

  async getRootCollections(args?: FilterTypes<ICollection>, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.initializeCache();
    this.initializeChildData();
    const data = this.getCachedData(), collections: Collection[] = [], collection_ids = (((data[this.child_path] as string[]).map((id) => this.cache.block.get(id) as TRootPage)).filter((cvp) => cvp.type === "collection_view_page") as IRootCollectionViewPage[]).map(cvp => cvp.collection_id);

    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const collection_id = args[index];
        const should_add = collection_ids.includes(collection_id);
        if (should_add)
          collections.push(new Collection({ ...this.getProps(), id: collection_id }))
        if (!multiple && collections.length === 1) break;
      }
    } else if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < collection_ids.length; index++) {
        const collection_id = collection_ids[index], collection = this.cache.collection.get(collection_id) as ICollection;
        const should_add = (typeof args === "function" ? await args(collection, index) : true);
        if (should_add)
          collections.push(new Collection({ ...this.getProps(), id: collection_id }))
        if (!multiple && collections.length === 1) break;
      }
    }
    return collections;
  }

  /**
   * Get pages from this space
   * @param arg criteria to filter pages by
   * @returns An array of pages object matching the passed criteria
   */
  async getTRootPages(args?: FilterTypes<TRootPage>, multiple?: boolean): Promise<(RootPage | RootCollectionViewPage)[]> {
    multiple = multiple ?? true;
    const props = this.getProps();
    return this.getItems<TRootPage>(args, multiple, async function (page) {
      return page.type === "collection_view_page" ? new CollectionViewPage({
        id: page.id,
        ...props
      }) : new RootPage({
        id: page.id,
        ...props
      })
    });
  }

  /**
   * Get a single page from this space
   * @param arg criteria to filter pages by
   * @returns A page object matching the passed criteria
   */
  async getTRootPage(arg?: FilterType<TPage>) {
    return (await this.getTRootPages(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  /**
   * Update a singular root page in the space
   * @param id id of the root page to update
   * @param opt object to configure root page
   */
  async updateRootPage(id: string, opt: Omit<IPageInput, "type">) {
    await this.updateRootPages([[id, opt]]);
  }

  /**
   * Update multiple root pages located in the space
   * @param arg Array of tuple, id and object to configure each root page
   * @param multiple whether multiple rootpages should be deleted
   */
  async updateRootPages(arg: [string, Omit<IPageInput, "type">][]) {
    const data = this.getCachedData(), ops: IOperation[] = [], current_time = Date.now(), block_ids: string[] = [];
    for (let index = 0; index < arg.length; index++) {
      const [id, opts] = arg[index];
      block_ids.push(id);
      if (data.pages.includes(id))
        ops.push(Operation.block.update(id, [], { ...opts, last_edited_time: current_time }))
      else
        throw new Error(error(`Space:${data.id} is not the parent of RootPage:${id}`));
    }
    await this.saveTransactions(ops);
    await this.updateCacheManually(block_ids);
  }

  // ? FEAT:1:M Empty userids for all user, a predicate
  /**
   * Remove multiple users from the current space
   * @param userIds ids of the user to remove from the workspace
   */
  async removeUsers(userIds: string[]) {
    const data = this.getCachedData();
    await this.removeUsersFromSpace({
      removePagePermissions: true,
      revokeUserTokens: false,
      spaceId: data?.id,
      userIds
    });
    this.updateCacheLocally({
      permissions: data.permissions.filter(permission => !userIds.includes(permission.user_id))
    }, ["permissions"]);
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteTRootPage(arg?: FilterType<TRootPage>) {
    return await this.deleteTRootPages(typeof arg === "string" ? [arg] : arg, false);
  }

  /**
   * Delete multiple root_pages or root_collection_view_pages from the space
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteTRootPages(args?: FilterTypes<TRootPage>, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.deleteItems<TRootPage>(args, multiple)
  }
}
