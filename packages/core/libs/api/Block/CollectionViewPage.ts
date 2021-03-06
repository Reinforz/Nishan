import { NotionCache } from '@nishans/cache';
import { NotionBlockPermissions } from '@nishans/permissions';
import { ICollectionViewPage, IPage, ISpace } from '@nishans/types';
import { NishanArg } from '../../';
import CollectionBlock from './CollectionBlock';

/**
 * A class to represent collection view page of Notion
 * @noInheritDoc
 */
class CollectionViewPage extends CollectionBlock<ICollectionViewPage> {
	Permissions: NotionBlockPermissions;
	constructor (arg: NishanArg) {
		super({ ...arg });
		this.Permissions = new NotionBlockPermissions(arg);
	}

	async getCachedParentData () {
		const data = this.getCachedData();
		return (await NotionCache.fetchDataOrReturnCached(data.parent_table, data.parent_id, this.getProps())) as
			| IPage
			| ISpace;
	}
}

export default CollectionViewPage;
