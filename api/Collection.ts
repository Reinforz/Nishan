import axios from "axios";

import { collectionSet } from '../utils/chunk';
import { error } from "../utils/logs";
import createTransaction from "../utils/createTransaction";

import Getters from "./Getters";

import { Collection as ICollection, NishanArg } from "../types";

class Collection extends Getters {
  collection_data: ICollection;

  constructor(arg: NishanArg & { collection_data: ICollection }) {
    super(arg);
    this.collection_data = arg.collection_data;
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
