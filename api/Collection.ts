import axios from "axios";

import { collectionSet } from '../utils/chunk';
import { error } from "../utils/logs";

import Getters from "./Getters";

import { Collection as ICollection, NishanArg } from "../types";

class Collection extends Getters {
  collection_data: ICollection;

  constructor(arg: NishanArg & { collection_data: ICollection }) {
    super(arg);
    this.collection_data = arg.collection_data;
  }

  async updateProperties(properties: { name: string[][], icon: string, description: string[][] }) {
    this.saveTransactions([
      [
        ...Object.entries(properties).map(([path, arg]) => collectionSet(this.collection_data.id, [path], arg)),
        collectionSet(this.collection_data.id, ['last_edited_time'], Date.now())
      ]
    ])
  }
}

export default Collection;
