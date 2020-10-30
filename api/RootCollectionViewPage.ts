import Permissions from './Permission';

import { error } from "../utils/logs";
import { NishanArg } from '../types/types';
import { ICollectionViewPage } from '../types/block';

/**
 * A class to represent collectionviewpage of Notion at the root level
 * @noInheritDoc
 */
class RootCollectionViewPage extends Permissions.collection_view_page {
  constructor(arg: NishanArg<ICollectionViewPage>) {
    super(arg);
    if (arg.data.type !== 'collection_view_page')
      throw new Error(error(`Cannot create collection_view_page block from ${arg.data.type} block`));
  }
}

export default RootCollectionViewPage;
