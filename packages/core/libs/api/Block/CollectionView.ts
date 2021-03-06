import { NotionCache } from '@nishans/cache';
import { ICollectionView, IPage } from '@nishans/types';
import { NishanArg } from '../../';
import CollectionBlock from './CollectionBlock';

/**
 * A class to represent collection view of Notion
 * @noInheritDoc
 */
class CollectionView extends CollectionBlock<ICollectionView> {
	constructor (arg: NishanArg) {
		super({ ...arg });
	}

	async getCachedParentData () {
		const data = this.getCachedData();
		return (await NotionCache.fetchDataOrReturnCached('block', data.parent_id, this.getProps())) as IPage;
	}
}

export default CollectionView;
