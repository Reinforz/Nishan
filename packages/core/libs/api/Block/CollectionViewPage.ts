import { NotionCache } from '@nishans/cache';
import { NotionPermissions } from '@nishans/permissions';
import { NotionBlockPermissions } from '@nishans/permissions/dist/libs/BlockPermissions';
import { ICollectionViewPage, IPage, ISpace } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import CollectionBlock from './CollectionBlock';

/**
 * A class to represent collection view page of Notion
 * @noInheritDoc
 */
class CollectionViewPage extends CollectionBlock<ICollectionViewPage> {
	Permissions: NotionBlockPermissions;
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
		this.Permissions = new NotionPermissions.Block(arg) as any;
	}

	async getCachedParentData () {
		const data = this.getCachedData();
		return (await NotionCache.fetchDataOrReturnCached(data.parent_table, data.parent_id, this.getProps())) as
			| IPage
			| ISpace;
	}
}

export default CollectionViewPage;
