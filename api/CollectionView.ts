import CollectionBlock from './CollectionBlock';

import { error } from "../utils/logs";
import { NishanArg } from '../types/types';
import { ICollectionView } from '../types/block';

/**
 * A class to represent collectionview of Notion
 * @noInheritDoc
 */
class CollectionView extends CollectionBlock {
  constructor(arg: NishanArg<ICollectionView>) {
    super(arg);
    if (arg.data.type !== 'collection_view')
      throw new Error(error(`Cannot create collection_view block from ${arg.data.type} block`));
  }
}

export default CollectionView;
