import { NotionCache } from '@nishans/cache';
import { NotionLineage } from '@nishans/lineage';
import { NotionOperations } from '@nishans/operations';
import { NotionPermissions } from '@nishans/permissions';
import { IPage, ISpace, ISpaceView, TBlock } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import Block from './Block';

/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

export default class PageBlock<T extends TBlock, U> extends Block<T, U, IPage | ISpace> {
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
	async toggleBookmarked () {
		const data = this.getCachedData();
    const space_view = NotionLineage.Space.getSpaceView(data.space_id, this.cache);

    if(space_view)
      await NotionOperations.executeOperations(
        [
          ...(await NotionLineage.updateChildContainer<ISpaceView>(
            'space_view',
            space_view.id,
            !(space_view.bookmarked_pages ?? []).includes(data.id),
            data.id,
            'bookmarked_pages',
            this.getProps()
          ))
        ],
        this.getProps()
      );
	}

	async toggleFollow () {
		const follow_id = NotionLineage.Page.getFollowId(this.id, this.cache)!;
		const follow = this.cache.follow.get(follow_id)!;
		await NotionOperations.executeOperations(
			[ NotionOperations.Chunk.follow.set(follow_id, [ 'following' ], !follow.following) ],
			this.getProps()
		);
		follow.following = !follow.following;
	}
}
