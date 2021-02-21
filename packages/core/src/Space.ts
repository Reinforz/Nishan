import { ICache, NotionCacheObject } from '@nishans/cache';
import { Mutations, Queries } from '@nishans/endpoints';
import { ICollection, ICollectionViewPage, INotionUser, IPage, ISpace, ISpaceView, IUserPermission, TPage, TSpaceMemberPermissionRole } from '@nishans/types';
import { CreateData, CreateMaps, error, PopulateMap, transformToMultiple } from '../libs';
import { FilterType, FilterTypes, ICollectionViewPageInput, ICollectionViewPageUpdateInput, IPageCreateInput, IPageMap, IPageUpdateInput, ISpaceUpdateInput, NishanArg, TSpaceUpdateKeys, UpdateType, UpdateTypes } from '../types';
import Data from './Data';
import SpaceView from "./SpaceView";

export async function createSpaceIterateArguments(block_id: string, cache: ICache, token: string): Promise<IPage | (ICollectionViewPage & {collection: ICollection}) | undefined>{
  const data = cache.block.get(block_id) as IPage | (ICollectionViewPage & {collection: ICollection});
  if(data){
    if(data.type === "page")
      return data;
    else if(data.type === "collection_view_page"){
      NotionCacheObject.fetchDataOrReturnCached('collection', data.collection_id, {token, interval: 0}, cache);
      return {
        ...data,
        collection: cache.collection.get(data.collection_id) as ICollection
      }
    }
  }
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
      if (space_view.space_id === this.id){
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

  async createRootPages(contents: (ICollectionViewPageInput | IPageCreateInput)[]) {
    return await CreateData.contents(contents, this.id, this.type as "space", this.getProps())
  }

  async getRootPage(arg?: FilterType<IPage | (ICollectionViewPage & ICollection)>) {
    return await this.getRootPages(transformToMultiple(arg), false);
  }

  async getRootPages(args?: FilterTypes<IPage | (ICollectionViewPage & {collection: ICollection})>, multiple?: boolean) {
    return await this.getIterate<IPage | (ICollectionViewPage & {collection: ICollection}), IPageMap>(args, { container: CreateMaps.page(), multiple, child_ids: "pages", child_type: "block" }, async (id) => {
      return await createSpaceIterateArguments(id, this.cache, this.token);
    }, async (_, page, page_map) => {
      await PopulateMap.page(page, page_map, this.getProps());
    });
  }

  /**
   * Update a singular root page in the space
   * @param id id of the root page to update
   * @param opt object to configure root page
   */
  async updateRootPage(arg: UpdateType<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput>,) {
    return await this.updateRootPages(transformToMultiple(arg),  false);
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
      container: CreateMaps.page()
    }, async (id) => {
      return await createSpaceIterateArguments(id, this.cache, this.token);
    }, async (_, page, __, page_map) => {
      await PopulateMap.page(page, page_map, this.getProps());
    });
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteRootPage(arg?: FilterType<TPage>) {
    await this.deleteRootPages(transformToMultiple(arg),  false);
  }

  /**
   * Delete multiple root_pages or root_collection_view_pages from the space
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteRootPages(args?: FilterTypes<TPage>, multiple?: boolean) {
    await this.deleteIterate<TPage>(args, {
      multiple,
      child_ids: 'pages',
      child_path: "pages",
      child_type: "block",
      container: []
    }, async (block_id) => {
      return await createSpaceIterateArguments(block_id, this.cache, this.token);
    })
  }

  async addMembers(infos: [string, TSpaceMemberPermissionRole][]) {
    const notion_users: INotionUser[] = [], data = this.getCachedData()
    for (let i = 0; i < infos.length; i++) {
      const [email, role] = infos[i], { value } = await Queries.findUser({email}, this.getConfigs());
      if (!value?.value) error(`User does not have a notion account`);
      else{
        const notion_user = value.value;
        const permission_data = { role, type: "user_permission", user_id: notion_user.id } as IUserPermission;
        this.Operations.pushToStack({
          args: permission_data,
          command: "setPermissionItem",
          id: this.id,
          path: ["permissions"],
          table: "space"
        });
        data.permissions.push(permission_data)
        notion_users.push(notion_user)
        this.logger && this.logger("UPDATE", "space", this.id)
      }
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
