import { NotionCache } from '@nishans/cache';
import {
	CreateData,
	IPageCreateInput,
	TBlockCreateInput,
	TBlockInput,
	updateChildContainer
} from '@nishans/fabricator';
import { NotionBlockPermissions } from '@nishans/permissions';
import { IPage, ISpace, ISpaceView, TBlock } from '@nishans/types';
import {
	CreateMaps,
	FilterType,
	FilterTypes,
	IBlockMap,
	NishanArg,
	PopulateMap,
	UpdateType,
	UpdateTypes
} from '../../';
import { transformToMultiple } from '../../utils';
import Block from './Block';

/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

export default class Page extends Block<IPage, IPageCreateInput> {
	Permissions: NotionBlockPermissions;

	constructor (arg: NishanArg) {
		super(arg);
		this.Permissions = new NotionBlockPermissions(arg);
	}

	async getCachedParentData () {
		const data = this.getCachedData();
		return (await NotionCache.fetchDataOrReturnCached(data.parent_table, data.parent_id, this.getProps())) as
			| ISpace
			| IPage;
	}

	/**
   * Add/remove this page from the favorite list
   */
	async updateBookmarkedStatus (favorite_status: boolean) {
		const data = this.getCachedData();
		let target_space_view: ISpaceView = null as any;
		for (const [ , space_view ] of this.cache.space_view) {
			if (space_view.space_id === data.space_id) {
				target_space_view = space_view;
				break;
			}
		}
		await updateChildContainer('space_view', target_space_view.id, favorite_status, data.id, this.getProps());
	}

	/**
   * Batch add multiple block as contents
   * @param contents array of options for configuring each content
   * @returns Array of newly created block content objects
   */
	async createBlocks (contents: TBlockCreateInput[]) {
		const block_map = CreateMaps.block(),
			props = this.getProps();
		await CreateData.contents(contents, this.id, this.type as 'block', props, async (block) => {
			await PopulateMap.block(block, block_map, props);
		});
		return block_map;
	}

	async getBlock (arg?: FilterType<TBlock>) {
		return await this.getBlocks(transformToMultiple(arg), false);
	}

	/**
   * Get all the blocks of the page as an object
   * @returns An array of block object
   */
	async getBlocks (args?: FilterTypes<TBlock>, multiple?: boolean) {
		return await this.getIterate<TBlock, IBlockMap>(
			args,
			{ container: CreateMaps.block(), multiple, child_ids: 'content', child_type: 'block' },
			(block_id) => this.cache.block.get(block_id) as TBlock,
			async (_, block, block_map) => {
				await PopulateMap.block(block, block_map, this.getProps());
			}
		);
	}

	async updateBlock (arg: UpdateType<TBlock, TBlockInput>) {
		return await this.updateBlocks(transformToMultiple(arg), false);
	}

	async updateBlocks (args: UpdateTypes<TBlock, TBlockInput>, multiple?: boolean) {
		return await this.updateIterate<TBlock, TBlockInput, IBlockMap>(
			args,
			{
				multiple,
				child_ids: 'content',
				child_type: 'block',
				container: CreateMaps.block()
			},
			(child_id) => this.cache.block.get(child_id),
			async (_, block, __, block_map) => {
				await PopulateMap.block(block, block_map, this.getProps());
			}
		);
	}

	/**
   * Delete a single block from a page
   * @param arg id string or a predicate acting as a filter
   */
	async deleteBlock (arg?: FilterType<TBlock>) {
		return await this.deleteBlocks(transformToMultiple(arg), false);
	}

	/**
   * Delete multiple blocks from a page
   * @param arg array of ids or a predicate acting as a filter
   */
	async deleteBlocks (args?: FilterTypes<TBlock>, multiple?: boolean) {
		await this.deleteIterate<TBlock>(
			args,
			{
				multiple,
				child_ids: 'content',
				child_path: 'content',
				child_type: 'block',
				container: []
			},
			(block_id) => this.cache.block.get(block_id)
		);
	}
}
