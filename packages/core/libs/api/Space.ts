import { NotionCache } from '@nishans/cache';
import { NotionEndpoints } from '@nishans/endpoints';
import { NotionErrors } from '@nishans/errors';
import { CreateData, ICollectionViewPageInput, ICollectionViewPageUpdateInput, IPageCreateInput, IPageUpdateInput } from '@nishans/fabricator';
import { NotionOperations } from '@nishans/operations';
import { ICollection, ICollectionViewPage, INotionUser, IOperation, IPage, ISpace, ISpaceView, IUserPermission, TPage, TSpaceMemberPermissionRole } from '@nishans/types';
import { CreateMaps, FilterType, FilterTypes, IPageMap, ISpaceUpdateInput, NishanArg, PopulateMap, TSpaceUpdateKeys, UpdateType, UpdateTypes } from '../';
import { transformToMultiple } from '../utils';
import Data from './Data';
import SpaceView from "./SpaceView";

export async function createSpaceIterateArguments(block_id: string, props: Pick<NishanArg, 'cache' | 'token' | 'interval' | 'user_id'>): Promise<IPage | (ICollectionViewPage & {collection: ICollection}) | undefined>{
  const data = await NotionCache.fetchDataOrReturnCached<IPage | (ICollectionViewPage & {collection: ICollection})>('block', block_id, props);
  if(data.type === "page")
    return data;
  else if(data.type === "collection_view_page"){
    await NotionCache.fetchDataOrReturnCached('collection', data.collection_id, props);
    return {
      ...data,
      collection: props.cache.collection.get(data.collection_id) as ICollection
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
  async update(opt: ISpaceUpdateInput) {
    await this.updateCacheLocally(opt, TSpaceUpdateKeys);
  }

  /**
   * Delete the current workspace
   */
  async delete() {
    await NotionEndpoints.Mutations.enqueueTask({
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
    const block_map = CreateMaps.block(), props = this.getProps();
    await CreateData.contents(contents, this.id, this.type as "space", this.getProps(), async (block)=>{
      await PopulateMap.block(block, block_map, props);
    });
    return block_map;
  }

  async getRootPage(arg?: FilterType<IPage | (ICollectionViewPage & {collection: ICollection})>) {
    return await this.getRootPages(transformToMultiple(arg), false);
  }

  async getRootPages(args?: FilterTypes<IPage | (ICollectionViewPage & {collection: ICollection})>, multiple?: boolean) {
    return await this.getIterate<IPage | (ICollectionViewPage & {collection: ICollection}), IPageMap>(args, { container: CreateMaps.page(), multiple, child_ids: "pages", child_type: "block" }, async (id) => await createSpaceIterateArguments(id, this.getProps()), async (_, page, page_map) => await PopulateMap.page(page, page_map, this.getProps()));
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
   * @param multiple whether multiple root pages should be deleted
   */
  async updateRootPages(args: UpdateTypes<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput>, multiple?: boolean) {
    return await this.updateIterate<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput, IPageMap>(args, {
      child_ids: "pages",
      child_type: "block",
      multiple,
      container: CreateMaps.page()
    }, 
      async (id) => await createSpaceIterateArguments(id, this.getProps()), 
      async (_, page, __, page_map) => await PopulateMap.page(page, page_map, this.getProps()));
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
    }, 
    async (block_id) => await createSpaceIterateArguments(block_id, this.getProps()))
  }

  async addMembers(infos: [string, TSpaceMemberPermissionRole][]) {
    const notion_users: INotionUser[] = [], data = this.getCachedData(), operations: IOperation[] = []
    for (let i = 0; i < infos.length; i++) {
      const [email, role] = infos[i], { value } = await NotionEndpoints.Queries.findUser({email}, this.getProps());
      if (!value?.value) NotionErrors.Log.error(`User does not have a notion account`);
      else{
        const notion_user = value.value;
        const permission_data = { role, type: "user_permission", user_id: notion_user.id } as IUserPermission;
        operations.push(NotionOperations.Chunk.space.setPermissionItem(this.id, ["permissions"], permission_data));
        data.permissions.push(permission_data)
        notion_users.push(notion_user)
        this.logger && this.logger("UPDATE", "space", this.id)
      }
    };
    await NotionOperations.executeOperations(
      [ ...operations, NotionOperations.Chunk.space.update(this.id, [], this.updateLastEditedProps()) ],
      this.getProps()
    )
    return notion_users;
  }

  // ? FEAT:1:M Empty user ids for all user, a predicate
  /**
   * Remove multiple users from the current space
   * @param userIds ids of the user to remove from the workspace
   */
  async removeUsers(userIds: string[]) {
    const data = this.getCachedData();
    await NotionEndpoints.Mutations.removeUsersFromSpace({
      removePagePermissions: true,
      revokeUserTokens: false,
      spaceId: data.id,
      userIds
    }, {
      token: this.token,
      interval: this.interval
    });
    data.permissions = data.permissions.filter(permission => !userIds.includes(permission.user_id));
    await NotionOperations.executeOperations(
      [ NotionOperations.Chunk.space.update(this.id, [], this.updateLastEditedProps()) ],
      this.getProps()
    )
  }
}
