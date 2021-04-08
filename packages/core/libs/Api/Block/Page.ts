import { NotionCache } from '@nishans/cache';
import { NotionFabricator, TBlockCreateInput, TBlockInput } from '@nishans/fabricator';
import { NotionLineage } from '@nishans/lineage';
import { NotionOperations } from '@nishans/operations';
import { NotionPermissions } from '@nishans/permissions';
import { FilterType, FilterTypes, UpdateType, UpdateTypes } from '@nishans/traverser';
import { IComment, IDiscussion, IPage, ISpace, ISpaceView, TBlock } from '@nishans/types';
import { IBlockMap, INotionCoreOptions, NotionCore } from '../../';
import { transformToMultiple } from '../../utils';
import Comment from '../Comment';
import Discussion from '../Discussion';
import Block from './Block';
/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

export default class Page extends Block<IPage, Partial<Pick<IPage, 'properties' | 'format'>>> {
	Permissions: InstanceType<typeof NotionPermissions.Block>;

	constructor (arg: INotionCoreOptions) {
		super(arg);
		this.Permissions = new NotionPermissions.Block(arg);
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
		await NotionOperations.executeOperations(
			[
				...(await NotionLineage.updateChildContainer<ISpaceView>(
					'space_view',
					target_space_view.id,
					favorite_status,
					data.id,
					'bookmarked_pages',
					this.getProps()
				))
			],
			this.getProps()
		);
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

	async getDiscussion (arg?: FilterType<IDiscussion>) {
		return (await this.getDiscussions(transformToMultiple(arg), false))[0];
	}

	async getDiscussions (args?: FilterTypes<IDiscussion>, multiple?: boolean) {
		const discussion_ids = NotionLineage.Page.getDiscussionIds(this.getCachedData(), this.cache);

		return await this.getIterate<IDiscussion, Discussion[]>(
			args,
			{ container: [], multiple, child_ids: discussion_ids, child_type: 'discussion' },
			(discussion_id) => this.cache.discussion.get(discussion_id),
			async (id, __, container) => container.push(new Discussion({ ...this.getProps(), id }))
		);
	}

	async getComment (arg?: FilterType<IComment>) {
		return (await this.getComments(transformToMultiple(arg), false))[0];
	}

	async getComments (args?: FilterTypes<IComment>, multiple?: boolean) {
		const comment_ids = NotionLineage.Page.getCommentIds(this.getCachedData(), this.cache);

		return await this.getIterate<IComment, Comment[]>(
			args,
			{ container: [], multiple, child_ids: comment_ids, child_type: 'comment' },
			(comment_id) => this.cache.comment.get(comment_id),
			async (id, __, container) => container.push(new Comment({ ...this.getProps(), id }))
		);
	}
}
