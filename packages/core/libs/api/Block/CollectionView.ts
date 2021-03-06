import { NotionCache } from '@nishans/cache';
import { ICollectionView, IPage } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import CollectionBlock from './CollectionBlock';

/**
 * A class to represent collection view of Notion
 * @noInheritDoc
 */
class CollectionView extends CollectionBlock<ICollectionView> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
	}

	async getCachedParentData () {
		const data = this.getCachedData();
		return (await NotionCache.fetchDataOrReturnCached('block', data.parent_id, this.getProps())) as IPage;
	}
}

export default CollectionView;
