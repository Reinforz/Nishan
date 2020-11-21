import Collection from './Collection';
import Block from './Block';
import { TableView, GalleryView, ListView, BoardView, TimelineView, CalendarView } from './View';

import { NishanArg, IOperation, TView, TCollectionBlock, FilterTypes, ITableView, IListView, IBoardView, IGalleryView, ITimelineView, ICalendarView, FilterType, TableViewCreateParams, TViewType, ICollection, ListViewCreateParams, BoardViewCreateParams } from '../types';
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
    return await this.#createViews(params, "table")
  }

  async createListView(param: ListViewCreateParams) {
    return (await this.createListViews([param]))[0]
  }

  async createListViews(params: ListViewCreateParams[]): Promise<ListView[]> {
    return await this.#createViews(params, "list")
  }

  async createBoardView(param: BoardViewCreateParams) {
    return (await this.createBoardViews([param]))[0]
  }

  async createBoardViews(params: BoardViewCreateParams[]): Promise<BoardView[]> {
    return await this.#createViews(params, "board")
  }

  /* async createGalleryView(param: GalleryViewCreateParams) {
    return (await this.createGalleryViews([param]))[0]
  }

  async createGalleryViews(params: GalleryViewCreateParams[]): Promise<GalleryView[]> {
    return await this.#createViews(params, "gallery")
  } */

  /**
   * Get all the views associated with the collection block
   * @returns An array of view objects of the collectionblock
   */
  #getViews = async<T extends TView, C extends (TableView | BoardView | ListView | CalendarView | TimelineView | GalleryView)>(arg: FilterTypes<T>, multiple: boolean = true, condition?: (Q: T) => boolean): Promise<C[]> => {
    const props = this.getProps();
    return this.getItems<T>(arg, multiple, async function (view) {
      switch (view.type) {
        case "table":
          return new TableView({
            id: view.id,
            ...props
          })
        case "board":
          return new BoardView({
            id: view.id,
            ...props
          })
        case "list":
          return new ListView({
            id: view.id,
            ...props
          })
        case "calendar":
          return new CalendarView({
            id: view.id,
            ...props
          })
        case "timeline":
          return new TimelineView({
            id: view.id,
            ...props
          })
        case "gallery":
          return new GalleryView({
            id: view.id,
            ...props
          })
      }
    }, condition)
  }

  async getTableView(arg: FilterType<ITableView>) {
    return (await this.getTableViews(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getTableViews(arg: FilterTypes<ITableView>, multiple: boolean = true): Promise<TableView[]> {
    return await this.#getViews<ITableView, TableView>(arg, multiple, (view) => view.type === "table")
  }

  async getListView(arg: FilterType<IListView>) {
    return (await this.getListViews(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getListViews(arg: FilterTypes<IListView>, multiple: boolean = true): Promise<ListView[]> {
    return await this.#getViews<IListView, ListView>(arg, multiple, (view) => view.type === "list")
  }

  async getBoardView(arg: FilterType<IBoardView>) {
    return (await this.getBoardViews(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getBoardViews(arg: FilterTypes<IBoardView>, multiple: boolean = true): Promise<TableView[]> {
    return await this.#getViews<IBoardView, BoardView>(arg, multiple, (view) => view.type === "board")
  }

  async getGalleryView(arg: FilterType<IGalleryView>) {
    return (await this.getGalleryViews(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getGalleryViews(arg: FilterTypes<IGalleryView>, multiple: boolean = true): Promise<GalleryView[]> {
    return await this.#getViews<IGalleryView, GalleryView>(arg, multiple, (view) => view.type === "gallery")
  }

  async getCalendarView(arg: FilterType<ICalendarView>) {
    return (await this.getCalendarViews(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getCalendarViews(arg: FilterTypes<ICalendarView>, multiple: boolean = true): Promise<CalendarView[]> {
    return await this.#getViews<ICalendarView, CalendarView>(arg, multiple, (view) => view.type === "calendar")
  }

  async getTimelineView(arg: FilterType<ITimelineView>) {
    return (await this.getTimelineViews(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getTimelineViews(arg: FilterTypes<ITimelineView>, multiple: boolean = true): Promise<TimelineView[]> {
    return await this.#getViews<ITimelineView, TimelineView>(arg, multiple, (view) => view.type === "timeline")
  }

  /**
   * Delete multiple root_pages or root_collection_view_pages
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteViews(arg: FilterTypes<TView>, multiple: boolean = true) {
    await this.deleteItems<TView>(arg as any, multiple)
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteView(arg: FilterType<TView>) {
    return await this.deleteViews(typeof arg === "string" ? [arg] : arg, false);
  }

  // ? FEAT:1:H Create updateView(s) methods, take help from view.updateView method
}

export default CollectionBlock;
