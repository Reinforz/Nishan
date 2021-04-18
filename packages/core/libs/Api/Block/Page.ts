import { NotionFabricator, TBlockCreateInput, TBlockInput } from '@nishans/fabricator';
import { FilterType, FilterTypes, UpdateType, UpdateTypes } from '@nishans/traverser';
import { IPage, TBlock } from '@nishans/types';
import { IBlockMap, INotionCoreOptions, NotionCore } from '../../';
import { transformToMultiple } from '../../utils';
import PageBlock from './PageBlock';

/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

export default class Page extends PageBlock<IPage, Partial<Pick<IPage, 'properties' | 'format'>>> {
	constructor (arg: INotionCoreOptions) {
		super(arg);
	}

	/**
   * Batch add multiple block as contents
   * @param contents array of options for configuring each content
   * @returns Array of newly created block content objects
   */
	async createBlocks (contents: TBlockCreateInput[]) {
		const block_map = NotionCore.CreateMaps.block(),
			props = this.getProps();
		await NotionFabricator.CreateData.contents(contents, this.id, this.type as 'block', props, async (block) => {
			await NotionCore.PopulateMap.block(block, block_map, props);
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
			{ container: NotionCore.CreateMaps.block(), multiple, child_ids: 'content', child_type: 'block' },
			(block_id) => this.cache.block.get(block_id) as TBlock,
			async (_, block, block_map) => {
				await NotionCore.PopulateMap.block(block, block_map, this.getProps());
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
				container: NotionCore.CreateMaps.block()
			},
			(child_id) => this.cache.block.get(child_id),
			async (_, block, __, block_map) => {
				await NotionCore.PopulateMap.block(block, block_map, this.getProps());
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
		return await this.deleteIterate<TBlock, IBlockMap>(
			args,
			{
				multiple,
				child_ids: 'content',
				child_path: 'content',
				child_type: 'block',
				container: NotionCore.CreateMaps.block()
			},
			(block_id) => this.cache.block.get(block_id),
			async (id, block, container) => NotionCore.PopulateMap.block(block, container, this.getProps())
		);
	}
}
