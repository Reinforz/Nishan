import { Mutations, Queries } from '@nishans/endpoints';
import { Operation } from '@nishans/operations';
import { IPage, ISpace, ISpaceView, TExportType, TBlock } from '@nishans/types';
import { NotionPermissions } from '../src';

import {
	NishanArg,
	TBlockCreateInput,
	FilterType,
	FilterTypes,
	UpdateType,
	TBlockInput,
	UpdateTypes,
	IBlockMap,
	IPageCreateInput
} from '../types';
import {
	createBlockClass,
	createBlockMap,
	CreateData,
	PopulateMap,
	transformToMultiple,
	updateBookmarkedPages
} from '../utils';
import Block from './Block';

/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

export default class Page extends Block<IPage, IPageCreateInput> {
	Permissions: NotionPermissions;

	constructor (arg: NishanArg) {
		super(arg);
		this.Permissions = new NotionPermissions(arg, arg.id, 'block');
	}

	getCachedParentData () {
		const data = this.getCachedData();
		return this.cache[data.parent_table].get(data.parent_id) as ISpace | IPage;
	}

	/**
   * Add/remove this page from the favourite list
   */
	async updateBookmarkedStatus (favourite_status: boolean) {
		const data = this.getCachedData();
		let target_space_view: ISpaceView = null as any;
		for (const [ , space_view ] of this.cache.space_view) {
			if (space_view.space_id === data.space_id) {
				target_space_view = space_view;
				break;
			}
		}

		updateBookmarkedPages(target_space_view, favourite_status, data.id, this.Operations.stack);
	}

	/**
   * Batch add multiple block as contents
   * @param contents array of options for configuring each content
   * @returns Array of newly created block content objects
   */
	async createBlocks (contents: TBlockCreateInput[]) {
		return await CreateData.createContents(contents, this.id, this.type as 'block', this.getProps());
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
			{ container: createBlockMap(), multiple, child_ids: 'content', child_type: 'block' },
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
				container: createBlockMap()
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
