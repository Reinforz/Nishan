import CollectionBlock from './CollectionBlock';

import { NishanArg } from '../types/types';

/**
 * A class to represent collectionviewpage of Notion
 * @noInheritDoc
 */
class CollectionViewPage extends CollectionBlock {
  constructor(arg: NishanArg) {
    super(arg);
  }
}

export default CollectionViewPage;
