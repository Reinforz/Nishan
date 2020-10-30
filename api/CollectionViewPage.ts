import Permission from './Permission';

import { error } from "../utils/logs";
import { NishanArg } from '../types/types';
import { ICollectionViewPage } from '../types/block';

/**
 * A class to represent collectionviewpage of Notion
 * @noInheritDoc
 */
class CollectionViewPage extends Permission.collection_block {
  constructor(arg: NishanArg<ICollectionViewPage>) {
    super(arg);
    if (arg.data.type !== 'collection_view_page')
      throw new Error(error(`Cannot create collection_view_page block from ${arg.data.type} block`));
  }
}

export default CollectionViewPage;
