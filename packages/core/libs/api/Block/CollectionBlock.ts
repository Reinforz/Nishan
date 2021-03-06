import { NotionCache } from '@nishans/cache';
import { NotionFabricator, TCollectionBlockInput, TViewCreateInput } from '@nishans/fabricator';
import { NotionOperations } from '@nishans/operations';
import { ICollection, TCollectionBlock, TView, TViewUpdateInput } from '@nishans/types';
import { CreateMaps, FilterType, FilterTypes, IViewMap, NishanArg, UpdateType, UpdateTypes } from '../../';
import { transformToMultiple } from '../../utils';
import Collection from '../Collection';
import { BoardView, CalendarView, GalleryView, ListView, TableView, TimelineView } from './../View';
import Block from './Block';

const view_class = {
	board: BoardView,
	gallery: GalleryView,
	list: ListView,
	timeline: TimelineView,
	table: TableView,
	calendar: CalendarView
};

/**
 * A class to represent collection block type in Notion
 * @noInheritDoc
 */
class CollectionBlock<T extends TCollectionBlock> extends Block<T, TCollectionBlockInput> {
	constructor (arg: NishanArg) {
		super({ ...arg });
	}

	/**
   * Fetch the corresponding collection of the collection block using the collection_id
   * @returns The corresponding collection object
   */
	async getCollection () {
		const data = this.getCachedData();
		await NotionCache.fetchDataOrReturnCached('collection', data.collection_id, this.getProps());
		return new Collection({
			...this.getProps(),
			id: data.collection_id
		});
	}

	async createViews (params: TViewCreateInput[]) {
		const data = this.getCachedData(),
			view_map = CreateMaps.view(),
			props = this.getProps(),
			views_data = await NotionFabricator.CreateData.views(
				this.cache.collection.get(data.collection_id) as ICollection,
				params,
				this.getProps(),
				data.id,
				(view) => {
					const view_obj = new view_class[view.type]({
						id: view.id,
						...props
					}) as any;
					view_map[view.type].set(view.id, view_obj);
					view_map[view.type].set(view.name, view_obj);
				}
			);
		const view_ids = views_data.map((view_data) => view_data.id);
		await NotionOperations.executeOperations(
			[
				NotionOperations.Chunk.block.set(data.id, [ 'view_ids' ], [ ...data.view_ids, ...view_ids ]),
				NotionOperations.Chunk.block.update(data.id, [], this.updateLastEditedProps())
			],
			this.getProps()
		);
		data.view_ids = [ ...data.view_ids, ...view_ids ];
		return view_map;
	}

	/**
   * Get all the views associated with the collection block
   * @returns An array of view objects of the collection block
   */
	async getViews (args?: FilterTypes<TView>, multiple?: boolean) {
		return await this.getIterate<TView, IViewMap>(
			args,
			{ multiple, container: CreateMaps.view(), child_ids: 'view_ids', child_type: 'collection_view' },
			(view_id) => this.cache.collection_view.get(view_id) as TView,
			(view_id, { type, name }, view_map) => {
				const view_obj = new view_class[type]({
					id: view_id,
					...this.getProps()
				}) as any;
				view_map[type].set(view_id, view_obj);
				view_map[type].set(name, view_obj);
			}
		);
	}

	async updateView (arg: UpdateType<TView, TViewUpdateInput>) {
		return await this.updateViews(transformToMultiple(arg), false);
	}

	async updateViews (args: UpdateTypes<TView, TViewUpdateInput>, multiple?: boolean) {
		return await this.updateIterate<TView, TViewUpdateInput, IViewMap>(
			args,
			{
				container: CreateMaps.view(),
				multiple,
				child_ids: 'view_ids',
				child_type: 'collection_view'
			},
			(view_id) => this.cache.collection_view.get(view_id),
			(id, { type, name }, _, view_map) => {
				const view_obj = new view_class[type]({ ...this.getProps(), id }) as any;
				view_map[type].set(id, view_obj);
				view_map[type].set(name, view_obj);
			}
		);
	}

	/**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
	async deleteView (arg?: FilterType<TView>) {
		return await this.deleteViews(transformToMultiple(arg), false);
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
				multiple,
				container: []
			},
			(view_id) => this.cache.collection_view.get(view_id)
		);
	}
}

export default CollectionBlock;
