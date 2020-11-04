import Permissions from './Permission';

import { NishanArg } from '../types/types';
import CollectionViewPage from './CollectionViewPage';

/**
 * A class to represent collectionviewpage of Notion at the root level
 * @noInheritDoc
 */
class RootCollectionViewPage extends Permissions(CollectionViewPage as any) {
  constructor(arg: NishanArg) {
    super(arg);
  }
}

export default RootCollectionViewPage;
