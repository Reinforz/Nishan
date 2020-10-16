import axios from "axios";

import { collectionSet } from '../utils/chunk';
import { error } from "../utils/logs";
import createTransaction from "../utils/createTransaction";

import { Collection as ICollection, NishanArg } from "../types";

class Collection {
  collection_data: ICollection;
  shard_id: number;
  space_id: string;
  headers: {
    headers: {
      cookie: string
    }
  }
  constructor(arg: NishanArg & { collection_data: ICollection }) {
    this.shard_id = arg.shard_id;
    this.space_id = arg.space_id;
    this.collection_data = arg.collection_data;
    this.headers = {
      headers: {
        cookie: `token_v2=${arg.token}`
      }
    }
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
