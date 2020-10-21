import CollectionBlock from './CollectionBlock';

import { error } from "../utils/logs";
import { NishanArg } from '../types/types';
import { ICollectionView } from '../types/block';

class CollectionView extends CollectionBlock {
  constructor(arg: NishanArg & {
    parent_id: string,
    block_data: ICollectionView,
  }) {
    super(arg);
    if (arg.block_data.type !== 'collection_view')
      throw new Error(error(`Cannot create collection_view block from ${arg.block_data.type} block`));
  }
}

export default CollectionView;
