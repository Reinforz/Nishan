import { NotionCache } from '@nishans/cache';
import { NotionEndpoints } from '@nishans/endpoints';
import { NotionErrors } from '@nishans/errors';
import {
  ICollectionViewPageInput,
  ICollectionViewPageUpdateInput,
  IPageCreateInput,
  IPageUpdateInput,
  NotionFabricator
} from '@nishans/fabricator';
import { NotionIdz } from '@nishans/idz';
import { NotionLineage } from '@nishans/lineage';
import { NotionLogger } from '@nishans/logger';
import { NotionPermissions } from '@nishans/permissions';
import {
  FilterType,
  FilterTypes,
  UpdateType,
  UpdateTypes
} from '@nishans/traverser';
import {
  ICollection,
  ICollectionViewPage,
  IPage,
  ISpace,
  ISpaceView,
  TPage
} from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import {
  INotionCoreOptions,
  IPageMap,
  ISpaceUpdateInput,
  NotionCore
} from '../';
import { createSpaceIterateData, transformToMultiple } from '../utils';
import Data from './Data';
import SpaceView from './SpaceView';

/**
 * A class to represent space of Notion
 * @noInheritDoc
 */
export default class Space extends Data<ISpace, ISpaceUpdateInput> {
  space_view: ISpaceView;
  Permissions: InstanceType<typeof NotionPermissions.Space>;

  constructor(arg: INotionCoreOptions) {
    super({ ...arg, type: 'space' });
    this.Permissions = new NotionPermissions.Space(arg);
    this.space_view = NotionLineage.Space.getSpaceView(this.id, this.cache)!;
  }

  /**
   * Get the space view associated with the space
   * @returns The associated space view object
   */
  getSpaceView() {
    this.logger &&
      NotionLogger.method.info(`READ space_view ${this.space_view.id}`);
    return new SpaceView({
      id: this.space_view.id,
      ...this.getProps()
    });
  }

  /**
   * Delete the current workspace
   */
  async delete() {
    await NotionEndpoints.Mutations.enqueueTask(
      {
        task: {
          eventName: 'deleteSpace',
          request: {
            spaceId: this.id
          }
        }
      },
      this.getProps()
    );
    this.logger && NotionLogger.method.info(`DELETE space ${this.id}`);
  }

  async createRootPages(
    contents: (ICollectionViewPageInput | IPageCreateInput)[]
  ) {
    const block_map = NotionCore.CreateMaps.block(),
      props = this.getProps();
    await NotionFabricator.CreateData.contents(
      contents,
      this.id,
      this.type as 'space',
      this.getProps(),
      async (block) => {
        await NotionCore.PopulateMap.block(block, block_map, props);
      }
    );
    return block_map;
  }

  async getRootPage(
    arg?: FilterType<
      IPage | (ICollectionViewPage & { collection: ICollection })
    >
  ) {
    return await this.getRootPages(transformToMultiple(arg), false);
  }

  async getRootPages(
    args?: FilterTypes<
      IPage | (ICollectionViewPage & { collection: ICollection })
    >,
    multiple?: boolean
  ) {
    return await this.getIterate<
      IPage | (ICollectionViewPage & { collection: ICollection }),
      IPageMap
    >(
      args,
      {
        container: NotionCore.CreateMaps.page(),
        multiple,
        child_ids: 'pages',
        child_type: 'block'
      },
      async (id) => await createSpaceIterateData(id, this.getProps()),
      async (_, page, page_map) =>
        await NotionCore.PopulateMap.page(page, page_map, this.getProps())
    );
  }

  /**
   * Update a singular root page in the space
   * @param id id of the root page to update
   * @param opt object to configure root page
   */
  async updateRootPage(
    arg: UpdateType<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput>
  ) {
    return await this.updateRootPages(transformToMultiple(arg), false);
  }

  /**
   * Update multiple root pages located in the space
   * @param arg Array of tuple, id and object to configure each root page
   * @param multiple whether multiple root pages should be deleted
   */
  async updateRootPages(
    args: UpdateTypes<TPage, IPageUpdateInput | ICollectionViewPageUpdateInput>,
    multiple?: boolean
  ) {
    return await this.updateIterate<
      TPage,
      IPageUpdateInput | ICollectionViewPageUpdateInput,
      IPageMap
    >(
      args,
      {
        child_ids: 'pages',
        child_type: 'block',
        multiple,
        container: NotionCore.CreateMaps.page()
      },
      async (id) => await createSpaceIterateData(id, this.getProps()),
      async (_, page, __, page_map) =>
        await NotionCore.PopulateMap.page(page, page_map, this.getProps())
    );
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteRootPage(arg?: FilterType<TPage>) {
    return await this.deleteRootPages(transformToMultiple(arg), false);
  }

  /**
   * Delete multiple root_pages or root_collection_view_pages from the space
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteRootPages(args?: FilterTypes<TPage>, multiple?: boolean) {
    return await this.deleteIterate<TPage, IPageMap>(
      args,
      {
        multiple,
        child_ids: 'pages',
        child_path: 'pages',
        child_type: 'block',
        container: NotionCore.CreateMaps.page()
      },
      async (block_id) =>
        await createSpaceIterateData(block_id, this.getProps()),
      async (_, page, page_map) =>
        await NotionCore.PopulateMap.page(page, page_map, this.getProps())
    );
  }

  async getPagesById(ids: string[]) {
    ids = ids.map((id) =>
      NotionIdz.Transform.toUuid(NotionIdz.Transform.toId(id))
    );
    const page_map = NotionCore.CreateMaps.page();
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      await NotionCache.initializeCacheForSpecificData(
        id,
        'block',
        this.getProps()
      );
      const page = this.cache.block.get(id) as TPage;
      if (page.type === 'page') {
        const page_obj = new NotionCore.Api.Page({
          ...this.getProps(),
          id: page.id
        });
        page_map.page.set(page.id, page_obj);
        page_map.page.set(
          NotionUtils.extractInlineBlockContent(page.properties.title),
          page_obj
        );
      } else if (page.type === 'collection_view_page') {
        const cvp_obj = new NotionCore.Api.CollectionViewPage({
          ...this.getProps(),
          id: page.id
        });
        const collection = this.cache.collection.get(
          page.collection_id
        ) as ICollection;
        page_map.collection_view_page.set(collection.name[0][0], cvp_obj);
        page_map.collection_view_page.set(page.id, cvp_obj);
      } else
        throw new NotionErrors.unsupported_block_type((page as any).type, [
          'page',
          'collection_view_page'
        ]);
    }
    return page_map;
  }
}
