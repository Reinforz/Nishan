import CollectionBlock from './CollectionBlock';

import { error } from "../utils/logs";
import { NishanArg } from '../types/types';
import { ICollectionViewPage } from '../types/block';

class CollectionViewPage extends CollectionBlock {
  constructor(arg: NishanArg & {
    block_data: ICollectionViewPage,
  }) {
    super(arg);
    if (arg.block_data.type !== 'collection_view_page')
      throw new Error(error(`Cannot create collection_view_page block from ${arg.block_data.type} block`));
  }
}

export default CollectionViewPage;
