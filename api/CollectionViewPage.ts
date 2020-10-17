import CollectionBlock from './CollectionBlock';

import { error } from "../utils/logs";
import { ICollectionViewPage, NishanArg } from '../types';

class CollectionViewPage extends CollectionBlock {
  constructor(arg: NishanArg & {
    parent_id: string,
    block_data: ICollectionViewPage,
  }) {
    super(arg);
    if (arg.block_data.type !== 'collection_view_page')
      throw new Error(error(`Cannot create collection_view_page block from ${arg.block_data.type} block`));
  }
}

export default CollectionViewPage;
