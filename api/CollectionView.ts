import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

import CollectionBlock from './CollectionBlock';

import { error, warn } from "../utils/logs";
import { Cache, Page, Space, CollectionView as ICollectionView } from '../types';

class CollectionView extends CollectionBlock {
  constructor({
    token,
    interval,
    user_id,
    shard_id,
    space_id,
    parent_id,
    block_data,
    cache
  }: {
    token: string,
    interval: number,
    user_id: string,
    shard_id: number,
    space_id: string,
    parent_id: string,
    block_data: ICollectionView,
    cache: Cache
  }) {
    super({
      cache,
      token,
      interval,
      user_id,
      shard_id,
      space_id,
      parent_id,
      block_data
    });
    if (block_data.type !== 'collection_view')
      throw new Error(error(`Cannot create collection_view block from ${block_data.type} block`));
  }
}

export default CollectionView;
