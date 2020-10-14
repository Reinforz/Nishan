import axios from "axios";


import { collectionSet } from '../utils/chunk';
import { error } from "../utils/logs";
import createTransaction from "../utils/createTransaction";

import { Collection as ICollection, ICollectionBlock } from "../types";
import Nishan from "./Nishan";

class Collection extends Nishan {
  collection_data: ICollection;
  parent_data: ICollectionBlock;

  constructor({
    token,
    interval,
    user_id,
    shard_id,
    space_id, parent_data, collection_data }: {
      token: string,
      interval: number,
      user_id: string,
      shard_id: number,
      space_id: string, parent_data: ICollectionBlock, collection_data: ICollection
    }) {
    super({
      token,
      interval,
      user_id,
      shard_id,
      space_id,
    })
    if (!parent_data.type.match(/collection_view/))
      throw new Error(error(`Cannot create collection block from ${parent_data.type} block`));
    this.collection_data = collection_data;
    this.parent_data = parent_data;
  }

  async updateProperties(properties: { name: string[][], icon: string, description: string[][] }) {
    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      createTransaction(this.shard_id, this.space_id, [
        [
          ...Object.entries(properties).map(([path, arg]) => collectionSet(this.collection_data.id, [path], arg)),
          collectionSet(this.collection_data.id, ['last_edited_time'], Date.now())
        ]
      ]),
      this.headers
    );
  }
}

export default Collection;
