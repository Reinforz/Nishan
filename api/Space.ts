import Data from './Data';
import SpaceView from "./SpaceView";

import { error } from '../utils';

import { ICollectionViewPageInput, UpdatableSpaceParams, IPageCreateInput, ISpace, ISpaceView, NishanArg, IOperation, FilterTypes, FilterType, ICollection, RepositionParams, ICollectionViewPage, IPage, TPage, INotionUser, TSpaceMemberPermissionRole, IPageUpdateInput, UpdateTypes, UpdateType, ICollectionViewPageUpdateInput } from '../types';
import Collection from './Collection';
import CollectionViewPage from './CollectionViewPage';
import Page from './Page';

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
    let target_space_view: ISpaceView | null = null;
    for (let [, space_view] of this.cache.space_view) {
      if (space_view.space_id === this.id) {
        target_space_view = space_view;
        break;
      }
    }
    return target_space_view;
  }

  getCollectionIds() {
    return this.getCachedData().pages.map((id) => this.cache.block.get(id) as TPage).filter((cvp) => cvp?.type === "collection_view_page").map(cvp => cvp.collection_id) as string[]
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
  async update(opt: UpdatableSpaceParams) {
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
  }

  async createTRootPages(options: ((ICollectionViewPageInput | IPageCreateInput) & { position?: RepositionParams })[], execute?: boolean) {
    const [ops, sync_records, block_map] = await this.nestedContentPopulate(options, this.id, "space");
    await this.executeUtil(ops, sync_records, execute);
    return block_map;
  }

  async getTRootPage(args?: FilterTypes<IPage | ICollectionViewPage>) {
    const troot_page = await this.getTRootPages(args, false);
    return {
      page: troot_page.page[0],
      collection_view_page: troot_page.collection_view_page[0]
    }
  }

  async getTRootPages(args?: FilterTypes<TPage>, multiple?: boolean) {
    const trootpage_map = this.createTRootPageMap(), props = this.getProps();
    await this.getIterate<TPage>(args, { multiple, child_ids: this.getCachedData().pages, subject_type: "Page" }, (block_id) => this.cache.block.get(block_id) as TPage, (_, page) => {
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
  async updateRootPage(arg: UpdateType<TPage, IPageUpdateInput>, execute?: boolean,) {
    return await this.updateRootPages(typeof arg === "function" ? arg : [arg], execute, false);
  }

  /**
   * Update multiple root pages located in the space
   * @param arg Array of tuple, id and object to configure each root page
   * @param multiple whether multiple rootpages should be deleted
   */
  async updateRootPages(args: UpdateTypes<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput>, execute?: boolean, multiple?: boolean) {
    const trootpage_map = this.createTRootPageMap();
    await this.updateIterate<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput>(args, {
      child_ids: this.getCachedData().pages,
      subject_type: "Page",
      child_type: "block",
      execute,
      multiple
    }, (id) => this.cache.block.get(id) as TPage, (id, data) => trootpage_map[data.type].push(new trootpage_class[data.type]({ ...this.getProps(), id }) as any));
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteTRootPage(arg?: FilterType<TPage>, execute?: boolean) {
    return await this.deleteTRootPages(typeof arg === "string" ? [arg] : arg, execute, false);
  }

  /**
   * Delete multiple root_pages or root_collection_view_pages from the space
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteTRootPages(args?: FilterTypes<TPage>, execute?: boolean, multiple?: boolean) {
    await this.deleteIterate<TPage>(args, {
      multiple,
      execute,
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
    }, (collection_id) => this.cache.collection.get(collection_id))).map(collection_id => new Collection({ ...this.getProps(), id: collection_id }));
  }

  async updateRootCollection(arg: UpdateType<ICollection, Partial<ICollection>>, execute?: boolean) {
    return (await this.updateRootCollections(typeof arg === "function" ? arg : [arg], execute, false))[0]
  }

  async updateRootCollections(args: UpdateTypes<ICollection, Partial<ICollection>>, execute?: boolean, multiple?: boolean) {
    return (await this.updateIterate<ICollection, Partial<ICollection>>(args, {
      child_ids: this.getCollectionIds(),
      subject_type: "Collection",
      child_type: "collection",
      execute,
      multiple
    }, (collection_id) => this.cache.collection.get(collection_id))).map(collection_id => new Collection({ ...this.getProps(), id: collection_id }))
  }

  async addMembers(infos: [string, TSpaceMemberPermissionRole][], execute?: boolean) {
    const ops: IOperation[] = [], notion_users: INotionUser[] = []
    for (let i = 0; i < infos.length; i++) {
      const [email, role] = infos[i], notion_user = await this.findUser(email);
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

    await this.executeUtil(ops, [this.id], execute);
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
    }, ["permissions"]);
  }
}
