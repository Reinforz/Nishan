import { ISpace, IPage } from '@nishan/types';
import { NishanArg } from '../types';
import CollectionBlock from './CollectionBlock';

/**
 * A class to represent collectionviewpage of Notion
 * @noInheritDoc
 */
class CollectionViewPage extends CollectionBlock {
	constructor (arg: NishanArg) {
		super({ ...arg, type: 'block' });
	}

	getCachedParentData () {
		const data = this.getCachedData();
		if (data.parent_table === 'space') return this.cache.space.get(data.parent_id) as ISpace;
		else return this.cache.block.get(data.parent_id) as IPage;
	}
}

export default CollectionViewPage;
