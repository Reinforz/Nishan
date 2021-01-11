import Collection from './Collection';
import Permissions from './Permissions';
import { TableView, GalleryView, ListView, BoardView, TimelineView, CalendarView } from './View';

import { createViewMap, createViews, Operation } from '../utils';
import { ICollectionViewPage, ICollection, TView, TViewUpdateInput } from '@nishans/types';
import { NishanArg, FilterTypes, UpdateType, UpdateTypes, FilterType, TViewCreateInput } from '../types';

const view_class = {
	board: BoardView,
	gallery: GalleryView,
	list: ListView,
	timeline: TimelineView,
	table: TableView,
	calendar: CalendarView
};

/**
 * A class to represent collectionblock type in Notion
 * @noInheritDoc
 */
class CollectionBlock extends Permissions<ICollectionViewPage> {
	constructor (arg: NishanArg & { type: 'block' }) {
		super({ ...arg });
	}

	/**
   * Fetch the corresponding collection of the collection block using the collection_id
   * @returns The corresponding collection object
   */
	async getCollection () {
		await this.initializeCache();
		return new Collection({
			...this.getProps(),
			id: this.getCachedData().collection_id
		});
	}

	createViews (params: TViewCreateInput[]) {
		const data = this.getCachedData(),
			collection = this.cache.collection.get(data.collection_id) as ICollection,
			[ view_ids, view_map ] = createViews(collection.schema, params, collection.id, this.id, this.getProps());
		this.stack.push(Operation.block.update(data.id, [], { view_ids: [ ...data.view_ids, ...view_ids ] }));
		data.view_ids = [ ...data.view_ids, ...view_ids ];
		this.updateLastEditedProps();
		return view_map;
	}

	/**
   * Get all the views associated with the collection block
   * @returns An array of view objects of the collectionblock
   */
	async getViews (args?: FilterTypes<TView>, multiple?: boolean) {
		const view_map = createViewMap();
		await this.getIterate<TView>(
			args,
			{ multiple, child_ids: 'view_ids', child_type: 'collection_view' },
			(view_id) => this.cache.collection_view.get(view_id) as TView,
			(view_id, { type, name }) => {
				const view_obj = new view_class[type]({
					id: view_id,
					...this.getProps()
				}) as any;
				view_map[type].set(view_id, view_obj);
				view_map[type].set(name, view_obj);
			}
		);
		return view_map;
	}

	async updateView (arg: UpdateType<TView, TViewUpdateInput>) {
		return await this.updateViews(typeof arg === 'function' ? arg : [ arg ], false);
	}

	async updateViews (args: UpdateTypes<TView, TViewUpdateInput>, multiple?: boolean) {
		const view_map = createViewMap();
		await this.updateIterate<TView, TViewUpdateInput>(
			args,
			{
				multiple,
				child_ids: this.getCachedData().view_ids,
				child_type: 'collection_view'
			},
			(view_id) => this.cache.collection_view.get(view_id),
			(id, { type, name }) => {
				const view_obj = new view_class[type]({ ...this.getProps(), id }) as any;
				view_map[type].set(id, view_obj);
				view_map[type].set(name, view_obj);
			}
		);
		return view_map;
	}

	/**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
	async deleteView (arg?: FilterType<TView>) {
		return await this.deleteViews(typeof arg === 'string' ? [ arg ] : arg, false);
	}

	/**
   * Delete multiple root_pages or root_collection_view_pages
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
	async deleteViews (args?: FilterTypes<TView>, multiple?: boolean) {
		await this.deleteIterate<TView>(
			args,
			{
				child_ids: 'view_ids',
				child_path: 'view_ids',
				child_type: 'collection_view',
				multiple
			},
			(view_id) => this.cache.collection_view.get(view_id)
		);
	}
}

export default CollectionBlock;
