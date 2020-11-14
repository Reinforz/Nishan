import { NishanArg } from '../types/types';
import CollectionViewPage from './CollectionViewPage';

/**
 * A class to represent collectionviewpage of Notion at the root level
 * @noInheritDoc
 */
class RootCollectionViewPage extends CollectionViewPage {
  constructor(arg: NishanArg) {
    super(arg);
  }
}

export default RootCollectionViewPage;
