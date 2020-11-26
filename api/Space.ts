import { v4 as uuidv4 } from 'uuid';

import Data from './Data';
import RootPage from "./RootPage";
import RootCollectionViewPage from './RootCollectionViewPage';
import SpaceView from "./SpaceView";

import { Operation, error } from '../utils';

import { CreateRootCollectionViewPageParams, CreateRootPageArgs, SpaceUpdateParam, IPageInput, ISpace, ISpaceView, NishanArg, IOperation, TPage, TRootPage, UpdateCacheManuallyParam, IRootCollectionViewPage, IRootPage, FilterTypes, FilterType, TDataType } from '../types';
import CollectionViewPage from './CollectionViewPage';

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
    if (target_space_view)
      return new SpaceView({
        id: target_space_view.id,
        ...this.getProps()
      });
  }

  // ? FEAT:1:M Update space permissions
  /**
   * Update the space settings
   * @param opt Properties of the space to update
   */
  async update(opt: SpaceUpdateParam) {
    const [op, update] = this.updateCacheLocally(opt, ['icon',
      'beta_enabled',
      'last_edited_time',
      'name']);

    await this.saveTransactions([
      op
    ]);

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
    this.cache.space.delete(this.id);
  }

  async createRootCollectionViewPage(option: CreateRootCollectionViewPageParams) {
    return (await this.createRootCollectionViewPages([option]))[0]
  }

  // ? RF:1:M Refactor to use Page.createCollectionViewPage method
  async createRootCollectionViewPages(options: CreateRootCollectionViewPageParams[]) {
    const ops: IOperation[] = [], root_collection_view_pages: RootCollectionViewPage[] = [], sync_records: UpdateCacheManuallyParam = [];

    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      const { properties, format, isPrivate } = option;
      const block_id = uuidv4(), [collection_id, create_view_ops, view_ids] = this.createCollection(option, block_id);
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
      root_collection_view_pages.push(new RootCollectionViewPage({
        ...this.getProps(),
        id: block_id
      }))
    }

    await this.saveTransactions(ops);
    await this.updateCacheManually(sync_records);
    return root_collection_view_pages;
  }

  // ? FEAT:1:M Batch rootpage creation
  /**
   * Create a new page using passed properties and formats
   * @param opts format and properties for the root page
   * @return Newly created Root page object
   */
  async createRootPage(opts: CreateRootPageArgs): Promise<RootPage> {
    return (await this.createRootPages([opts]))[0];
  }

  /**
   * Create new pages using passed properties and formats
   * @param opts array of format and properties for the root pages
   * @returns An array of newly created rootpage block objects
   */
  async createRootPages(opts: CreateRootPageArgs[]) {
    const ops: IOperation[] = [], ids: string[] = [];
    for (let index = 0; index < opts.length; index++) {
      const opt = opts[index],
        { position, properties = {}, format = {}, isPrivate = false } = opt,
        $block_id = uuidv4();
      const block_list_op = this.addToChildArray($block_id, position);
      ids.push($block_id);
      ops.push(Operation.block.update($block_id, [], {
        type: 'page',
        id: $block_id,
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
    };

    await this.saveTransactions(ops);
    await this.updateCacheManually(ids);
    return ids.map(id => new RootPage({
      ...this.getProps(),
      id
    }));
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

  // ? FEAT:1:H Update cache and class state
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

  /**
   * Update a singular root page in the space
   * @param id id of the root page to update
   * @param opt object to configure root page
   */
  async updateRootPage(id: string, opt: Omit<IPageInput, "type">) {
    await this.updateRootPages([[id, opt]]);
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
   * Delete multiple root_pages or root_collection_view_pages
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteTRootPages(args?: FilterTypes<TRootPage>, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.deleteItems<TRootPage>(args, multiple)
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteTRootPage(arg?: FilterType<TRootPage>) {
    return await this.deleteTRootPages(typeof arg === "string" ? [arg] : arg, false);
  }

  /* async returnArtifacts(manual_res: [IOperation[], UpdateCacheManuallyParam, (RootPage | {block: RootCollectionViewPage, collection: Collection, collection_views: View[]})][]) {
    const ops: IOperation[] = [], sync_records: UpdateCacheManuallyParam = [], objects: (RootPage | RootCollectionViewPage)[] = [];
    manual_res.forEach(manual_res => {
      ops.push(...manual_res[0]);
      sync_records.push(...manual_res[1]);
      objects.push(manual_res[2]);
    })
    await this.saveTransactions(ops);
    await this.updateCacheManually(sync_records);
    return objects;
  } */
}
