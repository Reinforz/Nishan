import { ICollectionView, IPage } from '@nishans/types';
import { NishanArg } from '../../types';
import CollectionBlock from './CollectionBlock';

/**
 * A class to represent collectionview of Notion
 * @noInheritDoc
 */
class CollectionView extends CollectionBlock<ICollectionView> {
	constructor (arg: NishanArg) {
		super({ ...arg });
	}

	getCachedParentData () {
		return this.cache.block.get(this.getCachedData().parent_id) as IPage;
	}
}

export default CollectionView;
