import { NotionCache } from '@nishans/cache';
import { NotionFabricator, TCollectionBlockInput, TViewCreateInput } from '@nishans/fabricator';
import { NotionOperations } from '@nishans/operations';
import { FilterType, FilterTypes, UpdateType, UpdateTypes } from '@nishans/traverser';
import { ICollection, TCollectionBlock, TView, TViewUpdateInput } from '@nishans/types';
import { CreateMaps, INotionCoreOptions, IViewMap } from '../../';
import { PopulateMap } from '../../PopulateMap';
import { transformToMultiple } from '../../utils';
import Collection from '../Collection';
import Block from './Block';

/**
 * A class to represent collection block type in Notion
 * @noInheritDoc
 */
class CollectionBlock<T extends TCollectionBlock, U extends TCollectionBlockInput> extends Block<T, U> {
	constructor (arg: INotionCoreOptions) {
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
				(view) => PopulateMap.view(view, props, view_map)
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
			(x_, view, view_map) => PopulateMap.view(view, this.getProps(), view_map)
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
			(_, view, __, view_map) => PopulateMap.view(view, this.getProps(), view_map)
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
		return await this.deleteIterate<TView, IViewMap>(
			args,
			{
				child_ids: 'view_ids',
				child_path: 'view_ids',
				child_type: 'collection_view',
				multiple,
				container: CreateMaps.view()
			},
			(view_id) => this.cache.collection_view.get(view_id),
			(_, view, view_map) => PopulateMap.view(view, this.getProps(), view_map)
		);
	}
}

export default CollectionBlock;
