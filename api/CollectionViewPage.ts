import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

import CollectionBlock from './CollectionBlock';

import { error, warn } from "../utils/logs";
import { Cache, CollectionViewPage as ICollectionViewPage } from '../types';

class CollectionViewPage extends CollectionBlock {
  block_data: ICollectionViewPage

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
    block_data: ICollectionViewPage,
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
    if (block_data.type !== 'collection_view_page')
      throw new Error(error(`Cannot create collection_view_page block from ${block_data.type} block`));
    this.block_data = block_data;
  }
}

export default CollectionViewPage;
