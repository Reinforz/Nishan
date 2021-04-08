import { NotionCache } from '@nishans/cache';
import { ICollectionViewPageInput } from '@nishans/fabricator';
import { NotionPermissions } from '@nishans/permissions';
import { ICollectionViewPage, IPage, ISpace } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import CollectionBlock from './CollectionBlock';

/**
 * A class to represent collection view page of Notion
 * @noInheritDoc
 */
class CollectionViewPage extends CollectionBlock<ICollectionViewPage, ICollectionViewPageInput> {
	Permissions: InstanceType<typeof NotionPermissions.Block>;
	constructor (arg: INotionCoreOptions) {
		super(arg);
		this.Permissions = new NotionPermissions.Block(arg);
	}

	async getCachedParentData () {
		const data = this.getCachedData();
		return (await NotionCache.fetchDataOrReturnCached(data.parent_table, data.parent_id, this.getProps())) as
			| IPage
			| ISpace;
	}
}

export default CollectionViewPage;
