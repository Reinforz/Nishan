import { v4 as uuidv4 } from 'uuid';

import Data from './Data';
import RootPage from "./RootPage";
import RootCollectionViewPage from './RootCollectionViewPage';
import SpaceView from "./SpaceView";

import { Operation, error, warn } from '../utils';

import { CreateRootCollectionViewPageParams, CreateRootPageArgs, SpaceUpdateParam, IRootPage, IPageInput, ISpace, ISpaceView, NishanArg, IOperation, Predicate, TPage, TRootPage, CreateTRootPagesParams, TCollectionViewBlock, UpdateCacheManuallyParam } from '../types';
import DBArtifacts from '../mixins/DBArtifacts';

/**
 * A class to represent space of Notion
 * @noInheritDoc
 */
class Space extends DBArtifacts(Data)<ISpace>{
  space_view?: ISpaceView;

  constructor(arg: NishanArg) {
    super({ ...arg, type: "space" });
  }

  async returnArtifacts(manual_res: [IOperation[], UpdateCacheManuallyParam, RootPage][]) {
    const ops: IOperation[] = [], sync_records: UpdateCacheManuallyParam = [], objects: RootPage[] = [];
    manual_res.forEach(manual_res => {
      ops.push(...manual_res[0]);
      sync_records.push(...manual_res[1]);
      objects.push(manual_res[2]);
    })
    await this.saveTransactions(ops);
    await this.updateCacheManually(sync_records);
    return objects;
  }

  async createTRootPages(params: CreateTRootPagesParams[]) {
    const manual_res: [IOperation[], UpdateCacheManuallyParam, RootPage][] = [];
    for (let index = 0; index < params.length; index++) {
      const param = params[index];
      manual_res.push([...await (param.type === "page" ? this.createRootPage(param, true) : this.createRootCollectionViewPage(param, true)) as [IOperation[], UpdateCacheManuallyParam, RootPage]]);
    }
    return await this.returnArtifacts(manual_res);
  }

  async createTRootPage(param: CreateTRootPagesParams) {
    return (await this.createTRootPages([param]))[0]
  }

  async createRootCollectionViewPage(option: CreateRootCollectionViewPageParams, manual?: boolean) {
    if (manual) return (await this.createRootCollectionViewPages([option], manual ?? false))
    return (await this.createRootCollectionViewPages([option], manual ?? false))[0];
  }

  // ? RF:1:M Refactor to use Page.createCollectionViewPage method
  async createRootCollectionViewPages(options: CreateRootCollectionViewPageParams[], manual: boolean = false) {
    const ops: IOperation[] = [],
      block_ids: [[string, TCollectionViewBlock], string, string[]][] = [],
      collection_ids: string[] = [],
      view_ids: string[] = [];

    for (let index = 0; index < options.length; index++) {
      const option = options[index], block_id = uuidv4(), collection_id = uuidv4();
      const { properties, format, schema, views } = this.createCollection(option, block_id)
      const gen_view_ids = views.map((view) => view.id);
      view_ids.push(...gen_view_ids);
      block_ids.push([[block_id, "collection_view_page"], collection_id, gen_view_ids]);
      const block_update_op = this.addToChildArray(block_id, option.position);

      ops.push(
        Operation.block.update(block_id, [], {
          type: 'page',
          id: block_id,
          permissions:
            [{ type: option.isPrivate ? 'user_permission' : 'space_permission', role: 'editor', user_id: this.user_id }],
          parent_id: this.id,
          parent_table: 'space',
          alive: true,
          properties,
          format,
        }),
        Operation.block.update(block_id, [], {
          type: 'collection_view_page',
          collection_id: collection_id,
          view_ids: gen_view_ids,
          properties: {},
        }),
        Operation.collection.update(collection_id, [], {
          id: collection_id,
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
        ...views
      );
      collection_ids.push(collection_id);
    }

    if (manual) return [ops, block_ids];
    else {
      await this.saveTransactions(ops);
      return await this.createDBArtifacts(block_ids);
    }
  }

  // ? FEAT:1:M Batch rootpage creation
  /**
   * Create a new page using passed properties and formats
   * @param opts format and properties for the root page
   * @return Newly created Root page object
   */
  async createRootPage(opts: CreateRootPageArgs, manual?: boolean): Promise<RootPage | [IOperation[], UpdateCacheManuallyParam, RootPage]> {
    return (await this.createRootPages([opts], manual ?? false))[0];
  }

  /**
   * Create new pages using passed properties and formats
   * @param opts array of format and properties for the root pages
   * @returns An array of newly created rootpage block objects
   */
  async createRootPages(opts: CreateRootPageArgs[], manual?: boolean) {
    const block_ids: string[] = [], manual_res: [IOperation[], UpdateCacheManuallyParam, RootPage][] = [];
    for (let index = 0; index < opts.length; index++) {
      const opt = opts[index];
      const { position, properties = {}, format = {}, isPrivate = false } = opt;
      const $block_id = uuidv4();
      block_ids.push($block_id);
      const block_list_op = this.addToChildArray($block_id, position);
      manual_res.push([[Operation.block.update($block_id, [], {
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
        block_list_op],
      [$block_id],
      new RootPage({
        ...this.getProps(),
        id: $block_id
      })]
      );
    };
    if (manual ?? false) return manual_res;
    else return await this.returnArtifacts(manual_res)
  }

  /**
   * Get pages from this space
   * @param arg criteria to filter pages by
   * @returns An array of pages object matching the passed criteria
   */
  async getPages(arg: undefined | string[] | Predicate<TRootPage>, multiple: boolean = true) {
    const pages: (RootPage | RootCollectionViewPage)[] = [];
    const data = this.getCachedData() as ISpace;
    for (let i = 0; i < data.pages.length; i++) {
      const page_id = data.pages[i];
      const page = this.cache.block.get(page_id) as TRootPage;
      let should_add = false;
      if (arg === undefined) should_add = true;
      else if (Array.isArray(arg) && arg.includes(page_id)) should_add = true;
      else if (typeof arg === 'function') should_add = await arg(page, i);

      if (should_add && page) {
        switch (page.type) {
          case 'page':
            pages.push(
              new RootPage({
                id: page.id,
                ...this.getProps()
              })
            );
            break;
          case 'collection_view_page':
            pages.push(
              new RootCollectionViewPage({
                id: page.id,
                ...this.getProps()
              })
            );
            break;
        }

        if (pages.length === 1 && multiple) break;
      }
    }
    return pages;

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

  // ? FIX:2:E Array iteration and predicate fix 
  /**
   * Delete multiple root_pages or root_collection_view_pages
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteTRootPages(arg: string[] | Predicate<IRootPage>, multiple: boolean = true) {
    const data = this.getCachedData() as ISpace,
      current_time = Date.now(),
      ops: IOperation[] = [],
      is_array = Array.isArray(arg),
      deleted_ids: string[] = [];
    for (let index = 0; index < data.pages.length; index++) {
      const id = data.pages[index];
      const page = this.cache.block.get(id) as IRootPage;
      const should_delete = is_array ? (arg as string[]).includes(id) : typeof arg === "function" ? await arg(page, index) : false;
      if (should_delete) {
        ops.push(Operation.block.update(id, [], {
          alive: false,
          last_edited_time: current_time
        }), this.listRemoveOp(['pages'], { id }), this.setOp(['last_edited_time'], current_time));
        deleted_ids.push(id);
      }
      if (!multiple && ops.length === 1) break;
    }
    await this.saveTransactions(ops);
    deleted_ids.forEach(deleted_id => this.cache.block.delete(deleted_id));
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteTRootPage(arg: string | Predicate<IRootPage>): Promise<void> {
    return await this.deleteTRootPages(typeof arg === "string" ? [arg] : arg, false);
  }

  // ? FEAT:1:H Update cache and class state
  /**
   * Update multiple root pages located in the space
   * @param arg Array of tuple, id and object to configure each root page
   * @param multiple whether multiple rootpages should be deleted
   */
  async updateRootPages(arg: [string, Omit<IPageInput, "type">][], multiple: boolean = true) {
    const data = this.getCachedData() as ISpace, ops: IOperation[] = [], current_time = Date.now(), block_ids: string[] = [];
    for (let index = 0; index < arg.length; index++) {
      const [id, opts] = arg[index];
      block_ids.push(id);
      if (data.pages.includes(id))
        ops.push(Operation.block.update(id, [], { ...opts, last_edited_time: current_time }))
      else
        throw new Error(error(`Space:${data.id} is not the parent of RootPage:${id}`));
      if (!multiple && ops.length === 1) break;
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
    await this.updateRootPages([[id, opt]], false);
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

  async toggleFavourites(arg: string[] | Predicate<TRootPage>, multiple: boolean = true) {
    const target_space_view = this.spaceView, data = this.getCachedData() as ISpace, ops: IOperation[] = [];
    if (target_space_view) {
      if (Array.isArray(arg)) {
        for (let index = 0; index < arg.length; index++) {
          const page_id = arg[index];
          if (data.pages.includes(page_id)) {
            const is_bookmarked = target_space_view?.bookmarked_pages?.includes(page_id);
            ops.push((is_bookmarked ? Operation.space_view.listRemove : Operation.space_view.listBefore)(target_space_view.id, ["bookmarked_pages"], {
              id: page_id
            }))
          } else
            warn(`Space:${this.id} doesnot contain Page:${page_id}`)
          if (!multiple && ops.length === 1) break;
        }
      } else if (typeof arg === "function") {
        for (let index = 0; index < data.pages.length; index++) {
          const page_id = data.pages[index];
          const page = this.getCachedData<IRootPage>(page_id);
          if (page.parent_id === this.id && await arg(page, index)) {
            const is_bookmarked = target_space_view?.bookmarked_pages?.includes(page_id);
            ops.push((is_bookmarked ? Operation.space_view.listRemove : Operation.space_view.listBefore)(target_space_view.id, ["bookmarked_pages"], {
              id: page_id
            }))
          }
          if (!multiple && ops.length === 1) break;
        }
      }
    }
    await this.saveTransactions(ops);
    target_space_view && await this.updateCacheManually([[target_space_view.id, "space_view"]]);
  }

  async toggleFavourite(arg: string | Predicate<TRootPage>) {
    return await this.toggleFavourites(typeof arg === "string" ? [arg] : arg, false);
  }

  /**
   * Delete the current workspace
   */
  async delete() {
    const data = this.getCachedData();
    await this.enqueueTask({
      eventName: 'deleteSpace',
      request:
      {
        spaceId: data.id
      }
    });
    this.cache.space.delete(data.id);
  }

  // ? FEAT:1:M Empty userids for all user, a predicate
  /**
   * Remove multiple users from the current space
   * @param userIds ids of the user to remove from the workspace
   */
  async removeUsers(userIds: string[]) {
    const data = this.getCachedData() as ISpace;
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
}

export default Space;