import axios from "axios";

import Transaction from "./Transaction";

const Block = require('../Block');
const View = require('../View');

const { collectionSet } = require('./utils');
const pluckKeys = require('../../utils/pluckKeys');

import { Collection as ICollection } from "../types";

class Collection extends Block {
  constructor({ parent_data, collection_data }: { collection_data: ICollection }) {
    super(parent_data);
    if (!parent_data.type.match(/collection_view/))
      throw new Error(error(`Cannot create collection_view_page block from ${parent_data.type} block`));
    this.collection_data = collection_data;
  }

  async updateProperties(properties) {
    const property_entries = Object.entries(
      pluckKeys(properties, this.collection_data, [
        ['name', (data) => [[data]]],
        ['description', (data) => [[data]]],
        'icon'
      ])
    );
    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      Transaction.createTransaction([
        [
          ...property_entries.map(([path, arg]) => collectionSet(this.collection_data.id, [path], arg)),
          collectionSet(this.collection_data.id, ['last_edited_time'], Date.now())
        ]
      ]),
      Collection.headers
    );
  }

  getSchemaKey(fn) {
    return Object.entries(this.collection_data.schema).find(([key, value]) => fn(value));
  }

  static async get(collection_id) {
    const { data: { recordMap: { collection } } } = await axios.post(
      'https://www.notion.so/api/v3/syncRecordValues',
      {
        requests: [
          {
            id: collection_id,
            table: 'collection',
            version: -1
          }
        ]
      },
      Collection.headers
    );

    const collection_data = collection[collection_id].value;

    const { data: { recordMap: { block } } } = await axios.post(
      'https://www.notion.so/api/v3/syncRecordValues',
      {
        requests: [
          {
            id: collection_data.parent_id,
            table: 'block',
            version: -1
          }
        ]
      },
      Collection.headers
    );

    return new Collection({
      parent_data: block[collection_data.parent_id].value,
      collection_data
    });
  }
}

module.exports = Collection;
