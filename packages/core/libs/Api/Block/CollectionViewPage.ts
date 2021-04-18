import { NotionCache } from '@nishans/cache';
import { ICollectionViewPageInput } from '@nishans/fabricator';
import { NotionPermissions } from '@nishans/permissions';
import { ICollectionViewPage, IPage, ISpace } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import { applyMixins } from '../../utils';
import CollectionBlock from './CollectionBlock';
import PageBlock from './PageBlock';

/**
 * A class to represent collection view page of Notion
 * @noInheritDoc
 */
interface CollectionViewPage
	extends CollectionBlock<ICollectionViewPage, ICollectionViewPageInput>,
		PageBlock<ICollectionViewPage, ICollectionViewPageInput> {}

class CollectionViewPage {
	Permissions: InstanceType<typeof NotionPermissions.Block>;
	constructor (arg: INotionCoreOptions) {
		this.Permissions = new NotionPermissions.Block(arg);
	}

	async getCachedParentData () {
		const data = this.getCachedData();
		return (await NotionCache.fetchDataOrReturnCached(data.parent_table, data.parent_id, this.getProps())) as
			| IPage
			| ISpace;
	}
}

applyMixins(CollectionViewPage, [ CollectionBlock, PageBlock ]);
export default CollectionViewPage;
