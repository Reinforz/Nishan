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
		return (await this.fetchDataOrReturnCached('block', data.parent_id)) as IPage;
	}
}

export default CollectionView;
