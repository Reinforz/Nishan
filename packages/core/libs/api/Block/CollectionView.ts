import { NotionCache } from '@nishans/cache';
import { ICollectionViewInput } from '@nishans/fabricator';
import { ICollectionView, IPage } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import CollectionBlock from './CollectionBlock';

/**
 * A class to represent collection view of Notion
 * @noInheritDoc
 */
class CollectionView extends CollectionBlock<ICollectionView, ICollectionViewInput> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
	}

	async getCachedParentData () {
		const data = this.getCachedData();
		return (await NotionCache.fetchDataOrReturnCached('block', data.parent_id, this.getProps())) as IPage;
	}
}

export default CollectionView;
