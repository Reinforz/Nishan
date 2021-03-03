import { RepositionParams, updateChildContainer } from '@nishans/fabricator';
import { ISpace, ISpaceView, IUserRoot, TBlock, TPage } from '@nishans/types';
import {
	CreateMaps,
	FilterType,
	FilterTypes,
	IPageMap,
	ISpaceViewUpdateInput,
	NishanArg,
	PopulateMap,
	TSpaceViewUpdateKeys,
	UpdateType,
	UpdateTypes
} from '../';
import { transformToMultiple } from '../utils';
import Data from './Data';
import Space from './Space';

/**
 * A class to represent spaceview of Notion
 * @noInheritDoc
 */
class SpaceView extends Data<ISpaceView> {
	constructor (arg: NishanArg) {
		super({ ...arg, type: 'space_view' });
	}

	getCachedParentData () {
		return this.cache.user_root.get(this.user_id) as IUserRoot;
	}

	async reposition (arg: RepositionParams) {
		await this.addToChildArray('user_root', this.getCachedParentData(), arg);
	}

	/**
   * Update the current space view
   * @param arg Options to update the spaceView
   */
	async update (arg: ISpaceViewUpdateInput) {
		await this.updateCacheLocally(arg, TSpaceViewUpdateKeys);
	}

	/**
   * Get the corresponding space associated with this space view
   * @returns The corresponding space object
   */
	getSpace () {
		const data = this.getCachedData();
		let target_space: ISpace = null as any;
		for (const [ , space ] of this.cache.space) {
			if (data && space.id === data.space_id) {
				target_space = space;
				break;
			}
		}
		this.logger && this.logger('READ', 'space', target_space.id);
		return new Space({
			id: target_space.id,
			...this.getProps()
		});
	}

	async getBookmarkedPage (arg: FilterType<TPage>) {
		return await this.getBookmarkedPages(transformToMultiple(arg), false);
	}

	async getBookmarkedPages (args: FilterTypes<TPage>, multiple?: boolean) {
		return await this.getIterate<TPage, IPageMap>(
			args,
			{
				child_ids: 'bookmarked_pages',
				child_type: 'block',
				multiple,
				container: CreateMaps.page()
			},
			(id) => this.cache.block.get(id) as TPage,
			async (_, page, page_map) => {
				await PopulateMap.page(page, page_map, this.getProps());
			}
		);
	}

	/**
  * Toggle a single page from the bookmark list
  * @param arg id string or a predicate filter function
  */
	async updateBookmarkedPage (arg: UpdateType<TPage, boolean>) {
		return await this.updateBookmarkedPages(transformToMultiple(arg), false);
	}

	/**
   * Toggle multiple pages from the bookmark list
   * @param arg string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
	async updateBookmarkedPages (args: UpdateTypes<TPage, boolean>, multiple?: boolean) {
		const data = this.getCachedData();
		await this.initializeCacheForThisData();
		return await this.updateIterate<TPage, boolean, IPageMap>(
			args,
			{
				child_ids: Array.from(this.cache.block.keys()).filter((id) =>
					(this.cache.block.get(id) as TBlock).type.match(/^(page|collection_view_page)$/)
				),
				child_type: 'block',
				multiple,
				manual: true,
				container: CreateMaps.page()
			},
			(id) => this.cache.block.get(id) as TPage,
			async (id, page, updated_favorite_status, page_map) => {
				await updateChildContainer('space_view', data.id, updated_favorite_status, id, this.getProps());
				await PopulateMap.page(page, page_map, this.getProps());
			}
		);
	}
}

export default SpaceView;
