import Collection from './Collection';
import Block from './Block';
import { TableView, GalleryView, ListView, BoardView, TimelineView, CalendarView } from './View';

import { NishanArg, IOperation, TView, TCollectionBlock, FilterTypes, FilterType, TableViewCreateParams, TViewType, ICollection, ListViewCreateParams, BoardViewCreateParams, GalleryViewCreateParams, CalendarViewCreateParams, TimelineViewCreateParams, ITView } from '../types';
import { createViews, Operation } from '../utils';

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
class CollectionBlock extends Block<TCollectionBlock, any> {
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

  // TODO RF:1:H Same view options as Page.createLinkedDBContent
  // ? FEAT:1:H Check which view supports what ie(filter, aggregration, sort, property reorder and toggle)

  #createViews = async (params: (Partial<(TableViewCreateParams | ListViewCreateParams | BoardViewCreateParams)>)[], type: TViewType) => {
    const ops: IOperation[] = [], view_ids: string[] = [];
    const data = this.getCachedData(), collection = this.cache.collection.get(data.collection_id) as ICollection;
    const schema_entries = Object.entries(collection.schema);

    params.map((param) => {
      const [view_id, common_props] = createViews(param, schema_entries, type, this.id);
      const block_list_op = this.addToChildArray(view_id, param.position);
      ops.push(block_list_op, Operation.collection_view.update(view_id as string, [], common_props));
    })

    await this.saveTransactions(ops);
    await this.updateCacheManually(view_ids.map(view_id => [view_id, "collection_view"]));

    return view_ids.map(view_id => new view_class[type]({ id: view_id, ...this.getProps() }))
  }

  async createTableView(param: TableViewCreateParams) {
    return (await this.createTableViews([param]))[0]
  }

  async createTableViews(params: TableViewCreateParams[]): Promise<TableView[]> {
    return (await this.#createViews(params, "table") as TableView[])
  }

  async createListView(param: ListViewCreateParams) {
    return (await this.createListViews([param]))[0]
  }

  async createListViews(params: ListViewCreateParams[]): Promise<ListView[]> {
    return (await this.#createViews(params, "list") as ListView[])
  }

  async createBoardView(param: BoardViewCreateParams) {
    return (await this.createBoardViews([param]))[0]
  }

  async createBoardViews(params: BoardViewCreateParams[]): Promise<BoardView[]> {
    return (await this.#createViews(params, "board") as BoardView[])
  }

  async createGalleryView(param: GalleryViewCreateParams) {
    return (await this.createGalleryViews([param]))[0]
  }

  async createGalleryViews(params: GalleryViewCreateParams[]): Promise<GalleryView[]> {
    return (await this.#createViews(params, "gallery") as GalleryView[])
  }

  async createCalendarView(param: CalendarViewCreateParams) {
    return (await this.createCalendarViews([param]))[0]
  }

  async createCalendarViews(params: CalendarViewCreateParams[]): Promise<CalendarView[]> {
    return (await this.#createViews(params, "calendar") as CalendarView[])
  }

  async createTimelineView(param: TimelineViewCreateParams) {
    return (await this.createTimelineViews([param]))[0]
  }

  async createTimelineViews(params: TimelineViewCreateParams[]): Promise<TimelineView[]> {
    return (await this.#createViews(params, "timeline") as TimelineView[])
  }

  /**
   * Get all the views associated with the collection block
   * @returns An array of view objects of the collectionblock
   */
  async getViews(args?: FilterTypes<TView>, multiple?: boolean) {
    multiple = multiple ?? true;
    const props = this.getProps(), view_map: ITView = {
      table: [],
      board: [],
      list: [],
      calendar: [],
      timeline: [],
      gallery: [],
    }, view_class_map = {
      table: TableView,
      gallery: GalleryView,
      list: ListView,
      board: BoardView,
      timeline: TimelineView,
      calendar: CalendarView
    };

    await this.getItems<TView>(args, multiple, async function (view) {
      console.log(view.type);
      view_map[view.type].push(new view_class_map[view.type]({
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
