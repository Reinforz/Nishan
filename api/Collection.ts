import { collectionSet } from '../utils/chunk';

import Getters from "./Getters";

import { ICollection, NishanArg } from "../types";

class Collection extends Getters {
  collection_data: ICollection;

  constructor(arg: NishanArg & { collection_data: ICollection }) {
    super(arg);
    this.collection_data = arg.collection_data;
  }

  async updateProperties(properties: { name: string[][], icon: string, description: string[][] }) {
    this.saveTransactions(
      [
        ...Object.entries(properties).map(([path, arg]) => collectionSet(this.collection_data.id, [path], arg)),
        collectionSet(this.collection_data.id, ['last_edited_time'], Date.now())
      ]
    )
  }
}

export default Collection;
