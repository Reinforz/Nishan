import { NotionCache } from '@nishans/cache';
import { IPageCreateInput, NotionFabricator, TBlockCreateInput, TBlockInput } from '@nishans/fabricator';
import { NotionLineage } from '@nishans/lineage';
import { NotionPermissions } from '@nishans/permissions';
import { NotionBlockPermissions } from '@nishans/permissions/dist/libs/Block';
import { FilterType, FilterTypes, UpdateType, UpdateTypes } from '@nishans/traverser';
import { IComment, IDiscussion, IPage, ISpace, ISpaceView, TBlock, TTextFormat } from '@nishans/types';
import { CreateMaps, IBlockMap, INotionCoreOptions, PopulateMap } from '../../';
import { transformToMultiple } from '../../utils';
import { Comment } from '../Comment';
import { Discussion } from '../Discussion';
import Block from './Block';

/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

export default class Page extends Block<IPage, IPageCreateInput> {
	Permissions: NotionBlockPermissions;

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
		await NotionLineage.updateChildContainer(
			'space_view',
			target_space_view.id,
			favorite_status,
			data.id,
			this.getProps()
		);
	}

	/**
   * Batch add multiple block as contents
   * @param contents array of options for configuring each content
   * @returns Array of newly created block content objects
   */
	async createBlocks (contents: TBlockCreateInput[]) {
		const block_map = CreateMaps.block(),
			props = this.getProps();
		await NotionFabricator.CreateData.contents(contents, this.id, this.type as 'block', props, async (block) => {
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
		await this.deleteBlocks(transformToMultiple(arg), false);
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

	async updateDiscussion (arg: UpdateType<IDiscussion, { context?: TTextFormat; resolved?: boolean }>) {
		return (await this.updateDiscussions(transformToMultiple(arg), false))[0];
	}

	async updateDiscussions (
		args: UpdateTypes<IDiscussion, { context?: TTextFormat; resolved?: boolean }>,
		multiple?: boolean
	) {
		const discussion_ids = NotionLineage.Page.getDiscussionIds(this.getCachedData(), this.cache);

		return await this.updateIterate<IDiscussion, { context?: TTextFormat; resolved?: boolean }, Discussion[]>(
			args,
			{
				multiple,
				child_ids: discussion_ids,
				child_type: 'discussion',
				container: []
			},
			(child_id) => this.cache.discussion.get(child_id),
			async (id, _, __, discussions) => {
				discussions.push(
					new Discussion({
						id,
						...this.getProps()
					})
				);
			}
		);
	}

	async deleteDiscussion (arg: FilterType<IDiscussion>) {
		return (await this.deleteDiscussions(transformToMultiple(arg), false))[0];
	}

	async deleteDiscussions (args: FilterTypes<IDiscussion>, multiple?: boolean) {
		const discussion_ids = NotionLineage.Page.getDiscussionIds(this.getCachedData(), this.cache);

		return await this.deleteIterate<IDiscussion, Discussion[]>(
			args,
			{
				child_path: 'discussions',
				multiple,
				child_ids: discussion_ids,
				child_type: 'discussion',
				container: []
			},
			(child_id) => this.cache.discussion.get(child_id)
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
