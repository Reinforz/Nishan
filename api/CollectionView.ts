import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

import CollectionBlock from './CollectionBlock';

import { error, warn } from "../utils/logs";
import { Cache, Page, Space, CollectionView as ICollectionView, NishanArg } from '../types';

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
