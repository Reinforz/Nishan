import { ICollectionViewPage, IPage, ISpace } from '@nishans/types';
import { NishanArg, NotionPermissions } from '../../';
import CollectionBlock from './CollectionBlock';

/**
 * A class to represent collection view page of Notion
 * @noInheritDoc
 */
class CollectionViewPage extends CollectionBlock<ICollectionViewPage> {
	Permissions: NotionPermissions;
	constructor (arg: NishanArg) {
		super({ ...arg });
		this.Permissions = new NotionPermissions(arg, arg.id, 'block');
	}

	getCachedParentData () {
		const data = this.getCachedData();
		return this.cache[data.parent_table].get(data.parent_id) as IPage | ISpace;
	}
}

export default CollectionViewPage;
