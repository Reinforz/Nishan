import Permissions from './Permission';

import { NishanArg } from '../types/types';

/**
 * A class to represent collectionviewpage of Notion at the root level
 * @noInheritDoc
 */
class RootCollectionViewPage extends Permissions.collection_view_page {
  constructor(arg: NishanArg) {
    super(arg);
  }
}

export default RootCollectionViewPage;
