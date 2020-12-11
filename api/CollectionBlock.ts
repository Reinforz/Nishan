import Collection from './Collection';
import Permissions from './Permissions';
import { TableView, GalleryView, ListView, BoardView, TimelineView, CalendarView } from './View';

import { NishanArg, IOperation, TView, FilterTypes, FilterType, ICollection, TSearchManipViewParam, ICollectionViewPage } from '../types';
import { Operation } from '../utils';

const view_class = {
  board: BoardView,
  gallery: GalleryView,
  list: ListView,
  timeline: TimelineView,
  table: TableView,
  calendar: CalendarView,
}

/**
 * A class to represent collectionblock type in Notion
 * @noInheritDoc
 */
class CollectionBlock extends Permissions<ICollectionViewPage> {
  constructor(arg: NishanArg & { type: "block" }) {
    super({ ...arg });
  }

  /**
   * Fetch the corresponding collection of the collection block using the collection_id
   * @returns The corresponding collection object
   */
  async getCollection() {
    await this.initializeCache();
    const data = this.getCachedData();
    return new Collection({
      ...this.getProps(),
      id: data.collection_id,
    });
  }

  async createViews(params: [TSearchManipViewParam, ...TSearchManipViewParam[]]) {
    const ops: IOperation[] = [], data = this.getCachedData(), collection = this.cache.collection.get(data.collection_id) as ICollection, [created_view_ops, view_infos] = this.createViewsUtils(collection.schema, params, collection.id, this.id), view_map = this.createViewMap();
    ops.push(...created_view_ops, Operation.block.update(data.id, [], { view_ids: [...data.view_ids, ...view_infos.map(view_info => view_info[0])] }));
    await this.saveTransactions(ops);
    await this.updateCacheManually(view_infos.map(view_info => [view_info[0], "collection_view"]));
    view_infos.map(view_info => view_map[view_info[1]].push(new view_class[view_info[1]]({ id: view_info[0], ...this.getProps() }) as any));
    return view_map;
  }

  /**
   * Get all the views associated with the collection block
   * @returns An array of view objects of the collectionblock
   */
  async getViews(args?: FilterTypes<TView>, multiple?: boolean) {
    multiple = multiple ?? true;
    const props = this.getProps(), view_map = this.createViewMap(), logger = this.logger;

    await this.getItems<TView>(args, multiple, async function (view) {
      logger && logger("READ", "View", view.id);
      view_map[view.type].push(new view_class[view.type]({
        id: view.id,
        ...props
      }) as any)
    })
    return view_map;
  }

  /**
   * Delete multiple root_pages or root_collection_view_pages
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteViews(args?: FilterTypes<TView>, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.deleteItems<TView>(args, multiple)
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteView(arg?: FilterType<TView>) {
    return await this.deleteViews(typeof arg === "string" ? [arg] : arg, false);
  }

  // ? FEAT:1:H Create updateView(s) methods, take help from view.updateView method
}

export default CollectionBlock;
