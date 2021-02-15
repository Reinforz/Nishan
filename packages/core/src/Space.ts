import Data from './Data';
import SpaceView from "./SpaceView";

import { createPageMap, error, nestedContentPopulate, transformToMultiple } from '../utils';

import Collection from './Collection';
import CollectionViewPage from './CollectionViewPage';
import Page from './Page';
import { ISpace, ISpaceView, TPage, IPage, ICollectionViewPage, ICollection, TSpaceMemberPermissionRole, INotionUser, IUserPermission } from '@nishans/types';
import { NishanArg, ISpaceUpdateInput, TSpaceUpdateKeys, ICollectionViewPageInput, IPageCreateInput, RepositionParams, FilterType, FilterTypes, UpdateType, IPageUpdateInput, UpdateTypes, ICollectionViewPageUpdateInput, IPageMap } from '../types';
import { Mutations, Queries } from '@nishans/endpoints';

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

  getRootCollectionIds() {
    return (this.getCachedData().pages.map((id) => this.cache.block.get(id) as TPage).filter((cvp) => cvp?.type === "collection_view_page") as ICollectionViewPage[]).map(cvp => cvp.collection_id) as string[]
  }

  /**
   * Get the space view associated with the space
   * @returns The associated space view object
   */
  getSpaceView() {
    const target_space_view = this.spaceView;
    this.logger && this.logger("READ", "space_view", target_space_view.id)
    return new SpaceView({
      id: target_space_view.id,
      ...this.getProps()
    });
  }

  /**
   * Update the space settings
   * @param opt Properties of the space to update
   */
  update(opt: ISpaceUpdateInput) {
    this.updateCacheLocally(opt, TSpaceUpdateKeys);
  }

  /**
   * Delete the current workspace
   */
  async delete() {
    await Mutations.enqueueTask({
      task: {
        eventName: 'deleteSpace',
        request:
        {
          spaceId: this.id
        }
      }
    }, {
      token: this.token,
      interval: this.interval
    });
    this.logger && this.logger("DELETE", "space", this.id);
  }

  async createTRootPages(contents: ((ICollectionViewPageInput | IPageCreateInput) & { position?: RepositionParams })[]) {
    return await nestedContentPopulate(contents, this.id, this.type as "space", this.getProps())
  }

  async getTRootPage(args?: FilterType<IPage | ICollectionViewPage>) {
    return await this.getTRootPages(typeof args === "string" ? [args] : args, false);
  }

  async getTRootPages(args?: FilterTypes<TPage>, multiple?: boolean) {
    return await this.getIterate<TPage, IPageMap>(args, { container: createPageMap(), multiple, child_ids: "pages", child_type: "block" }, (block_id) => this.cache.block.get(block_id) as TPage, (_, page, trootpage_map) => {
      const page_obj: any = new trootpage_class[page.type]({
        id: page.id,
        ...this.getProps()
      });
      if(page.type === "page") trootpage_map[page.type].set(page.properties.title[0][0], page_obj);
      else{
        const collection = this.cache.collection.get(page.collection_id);
        if(collection) trootpage_map[page.type].set(collection.name[0][0], page_obj);
      }
      trootpage_map[page.type].set(page.id, page_obj)
    });
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
    return await this.updateIterate<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput, IPageMap>(args, {
      child_ids: "pages",
      child_type: "block",
      multiple,
      container: createPageMap()
    }, (id) => this.cache.block.get(id) as TPage, (id, page,__,trootpage_map) => {
      const page_obj: any = new trootpage_class[page.type]({
        id: page.id,
        ...this.getProps()
      });
      if(page.type === "page") trootpage_map[page.type].set(page.properties.title[0][0], page_obj);
      else{
        const collection = this.cache.collection.get(page.collection_id);
        if(collection) trootpage_map[page.type].set(collection.name[0][0], page_obj);
      }
      trootpage_map[page.type].set(page.id, page_obj)
    });
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteTRootPage(arg?: FilterType<TPage>) {
    return await this.deleteTRootPages(transformToMultiple(arg),  false);
  }

  /**
   * Delete multiple root_pages or root_collection_view_pages from the space
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteTRootPages(args?: FilterTypes<TPage>, multiple?: boolean) {
    await this.deleteIterate<TPage>(args, {
      multiple,
      child_ids: 'pages',
      child_path: "pages",
      child_type: "block",
      container: []
    }, (block_id) => this.cache.block.get(block_id) as TPage)
  }

  async getRootCollection(arg?: FilterType<ICollection>) {
    return (await this.getRootCollections(transformToMultiple(arg), true))[0]
  }

  async getRootCollections(args?: FilterTypes<ICollection>, multiple?: boolean) {
    return await this.getIterate<ICollection, Collection[]>(args, {
      child_type: "collection",
      multiple,
      container: [],
      child_ids: this.getRootCollectionIds(),
    }, (collection_id) => this.cache.collection.get(collection_id), (id,_,collections)=>collections.push(new Collection({ ...this.getProps(), id })));
  }

  async addMembers(infos: [string, TSpaceMemberPermissionRole][]) {
    const notion_users: INotionUser[] = [],data = this.getCachedData()
    for (let i = 0; i < infos.length; i++) {
      const [email, role] = infos[i], { value } = await Queries.findUser({email}, this.getConfigs());
      if (!value?.value) error(`User does not have a notion account`);
      else{
        const notion_user = value.value;
        const permission_data = { role, type: "user_permission", user_id: notion_user.id } as IUserPermission;
        this.Operations.stack.push({
          args: permission_data,
          command: "setPermissionItem",
          id: this.id,
          path: ["permissions"],
          table: "space"
        });
        data.permissions.push(permission_data)
        notion_users.push(notion_user)
      }
      this.logger && this.logger("UPDATE", "space", this.id)
    }
    this.updateLastEditedProps();
    return notion_users;
  }

  // ? FEAT:1:M Empty userids for all user, a predicate
  /**
   * Remove multiple users from the current space
   * @param userIds ids of the user to remove from the workspace
   */
  async removeUsers(userIds: string[]) {
    const data = this.getCachedData();
    await Mutations.removeUsersFromSpace({
      removePagePermissions: true,
      revokeUserTokens: false,
      spaceId: data.id,
      userIds
    }, {
      token: this.token,
      interval: this.interval
    });
    data.permissions = data.permissions.filter(permission => !userIds.includes(permission.user_id))
    this.updateLastEditedProps();
  }
}
