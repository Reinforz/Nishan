import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

import CollectionBlock from './CollectionBlock';

import { error, warn } from "../utils/logs";
import { Page, Space, CollectionViewPage as ICollectionViewPage } from '../types';

class CollectionViewPage extends CollectionBlock {
  constructor({
    token,
    interval,
    user_id,
    shard_id,
    space_id,
    parent_data,
    block_data
  }: {
    token: string,
    interval: number,
    user_id: string,
    shard_id: number,
    space_id: string,
    parent_data: Page | Space,
    block_data: ICollectionViewPage
  }) {
    super({
      token,
      interval,
      user_id,
      shard_id,
      space_id,
      parent_data,
      block_data
    });
    if (block_data.type !== 'collection_view_page')
      throw new Error(error(`Cannot create collection_view_page block from ${block_data.type} block`));
  }
}

export default CollectionViewPage;
