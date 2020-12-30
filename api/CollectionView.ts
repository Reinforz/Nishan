import CollectionBlock from './CollectionBlock';

import { IPage, NishanArg } from '../types';

/**
 * A class to represent collectionview of Notion
 * @noInheritDoc
 */
class CollectionView extends CollectionBlock {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "block" });
  }

  getCachedParentData() {
    return this.cache.block.get(this.getCachedData().parent_id) as IPage;
  }
}

export default CollectionView;
