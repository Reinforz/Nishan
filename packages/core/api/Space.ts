import Data from './Data';
import SpaceView from "./SpaceView";

import { createPageMap, error } from '../utils';

import Collection from './Collection';
import CollectionViewPage from './CollectionViewPage';
import Page from './Page';
import { ISpace, ISpaceView, TPage, IPage, ICollectionViewPage, ICollection, TSpaceMemberPermissionRole, IOperation, INotionUser } from '@nishans/types';
import { NishanArg, ISpaceUpdateInput, TSpaceUpdateKeys, ICollectionViewPageInput, IPageCreateInput, RepositionParams, FilterType, FilterTypes, UpdateType, IPageUpdateInput, UpdateTypes, ICollectionViewPageUpdateInput } from '../types';

const trootpage_class = {
  page: Page,
  collection_view_page: CollectionViewPage
}

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
    let target_space_view: ISpaceView = null as any;
    for (const [, space_view] of this.cache.space_view) {
      if (space_view.space_id === this.id)
        target_space_view = space_view;
    }
    return target_space_view;
  }

  getCollectionIds() {
    return (this.getCachedData().pages.map((id) => this.cache.block.get(id) as TPage).filter((cvp) => cvp?.type === "collection_view_page") as ICollectionViewPage[]).map(cvp => cvp.collection_id) as string[]
  }

  /**
   * Get the space view associated with the space
   * @returns The associated space view object
   */
  getSpaceView() {
    const target_space_view = this.spaceView;
    this.logger && this.logger("READ", "SpaceView", target_space_view.id)
    return new SpaceView({
      id: target_space_view.id,
      ...this.getProps()
    });
  }

  /**
   * Update the space settings
   * @param opt Properties of the space to update
   */
  async update(opt: ISpaceUpdateInput, ) {
    await this.updateCacheLocally(opt, TSpaceUpdateKeys, );
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
  }

  async createTRootPages(options: ((ICollectionViewPageInput | IPageCreateInput) & { position?: RepositionParams })[], ) {
    return await this.nestedContentPopulateAndExecute(options, );
  }

  async getTRootPage(args?: FilterType<IPage | ICollectionViewPage>) {
    return await this.getTRootPages(typeof args === "string" ? [args] : args, false);
  }

  async getTRootPages(args?: FilterTypes<TPage>, multiple?: boolean) {
    const trootpage_map = createPageMap(), props = this.getProps();
    await this.getIterate<TPage>(args, { multiple, child_ids: "pages", subject_type: "Page" }, (block_id) => this.cache.block.get(block_id) as TPage, (_, page) => {
      trootpage_map[page.type].push(new trootpage_class[page.type]({
        id: page.id,
        ...props
      }) as any)
    });
    return trootpage_map;
  }

  /**
   * Update a singular root page in the space
   * @param id id of the root page to update
   * @param opt object to configure root page
   */
  async updateRootPage(arg: UpdateType<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput>,) {
    return await this.updateRootPages(typeof arg === "function" ? arg : [arg],  false);
  }

  /**
   * Update multiple root pages located in the space
   * @param arg Array of tuple, id and object to configure each root page
   * @param multiple whether multiple rootpages should be deleted
   */
  async updateRootPages(args: UpdateTypes<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput>, multiple?: boolean) {
    const trootpage_map = createPageMap();
    await this.updateIterate<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput>(args, {
      child_ids: this.getCachedData().pages,
      subject_type: "Page",
      child_type: "block",
      
      multiple
    }, (id) => this.cache.block.get(id) as TPage, (id, data) => trootpage_map[data.type].push(new trootpage_class[data.type]({ ...this.getProps(), id }) as any));
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteTRootPage(arg?: FilterType<TPage>, ) {
    return await this.deleteTRootPages(typeof arg === "string" ? [arg] : arg,  false);
  }

  /**
   * Delete multiple root_pages or root_collection_view_pages from the space
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteTRootPages(args?: FilterTypes<TPage>, multiple?: boolean) {
    await this.deleteIterate<TPage>(args, {
      multiple,
      
      child_ids: this.getCachedData().pages,
      child_path: "pages",
      child_type: "block",
      subject_type: "Page"
    }, (block_id) => this.cache.block.get(block_id) as TPage)
  }

  async getRootCollection(arg?: FilterType<ICollection>) {
    return (await this.getRootCollections(typeof arg === "string" ? [arg] : arg, true))[0]
  }

  async getRootCollections(args?: FilterTypes<ICollection>, multiple?: boolean) {
    return (await this.getIterate(args, {
      subject_type: "Collection",
      multiple,
      child_ids: this.getCollectionIds(),
    }, (collection_id) => this.cache.collection.get(collection_id))).map(({ id }) => new Collection({ ...this.getProps(), id }));
  }

  async updateRootCollection(arg: UpdateType<ICollection, Partial<ICollection>>, ) {
    return (await this.updateRootCollections(typeof arg === "function" ? arg : [arg],  false))[0]
  }

  async updateRootCollections(args: UpdateTypes<ICollection, Partial<ICollection>>, multiple?: boolean) {
    return (await this.updateIterate<ICollection, Partial<ICollection>>(args, {
      child_ids: this.getCollectionIds(),
      subject_type: "Collection",
      child_type: "collection",
      
      multiple
    }, (collection_id) => this.cache.collection.get(collection_id))).map(collection_id => new Collection({ ...this.getProps(), id: collection_id }))
  }

  async addMembers(infos: [string, TSpaceMemberPermissionRole][], ) {
    const ops: IOperation[] = [], notion_users: INotionUser[] = []
    for (let i = 0; i < infos.length; i++) {
      const [email, role] = infos[i], { value: { value: notion_user } } = await this.findUser(email);
      if (!notion_user) error(`User does not have a notion account`);
      else
        ops.push({
          args: { role, type: "user_permission", user_id: notion_user.id },
          command: "setPermissionItem",
          id: this.id,
          path: ["permissions"],
          table: "space"
        });
      notion_users.push(notion_user)
      this.logger && this.logger("UPDATE", "Space", this.id)
    }
    // ? FEAT:1:H Update local cache
    this.stack.push(...ops);
    return notion_users;
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
      spaceId: data.id,
      userIds
    });
    this.updateCacheLocally({
      permissions: data.permissions.filter(permission => !userIds.includes(permission.user_id))
    }, ["permissions"], false);
  }
}
