import CollectionBlock from './CollectionBlock';

import { NishanArg } from '../types/types';

/**
 * A class to represent collectionview of Notion
 * @noInheritDoc
 */
class CollectionView extends CollectionBlock {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "block" });
  }
}

export default CollectionView;
