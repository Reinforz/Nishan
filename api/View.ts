import axios from "axios";

import { collectionViewUpdate } from '../utils/chunk';

import { NishanArg, Cache, TView, ViewAggregations, ViewFormatProperties } from "../types";
import createTransaction from "../utils/createTransaction";

class View {
  parent_id: string;
  view_data: TView;
  token: string;
  interval: number;
  user_id: string;
  shard_id: number;
  space_id: string;
  cache: Cache;
  headers: {
    headers: {
      cookie: string
    }
  };
  createTransaction: any;

  constructor(arg: NishanArg & {
    parent_id: string,
    view_data: TView,
  }) {

    this.token = arg.token,
      this.interval = arg.interval,
      this.user_id = arg.user_id,
      this.shard_id = arg.shard_id,
      this.space_id = arg.space_id,
      this.parent_id = arg.parent_id;
    this.view_data = arg.view_data;
    this.headers = {
      headers: {
        cookie: `token_v2=${arg.token}`
      }
    }
    this.cache = arg.cache;
    this.createTransaction = createTransaction.bind(this, arg.shard_id, arg.space_id);
  }

  async update(options: { sorts?: [string, 1 | -1][], filters?: [string, string, string, string][], properties?: ViewFormatProperties[], aggregations?: ViewAggregations[] } = {}) {
    const { sorts = [], filters = [], properties = [], aggregations = [] } = options;
    const args: any = {};

    if (sorts && sorts.length !== 0) {
      if (!args.query2) args.query2 = {};
      args.query2.sort = sorts.map((sort) => ({
        property: sort[0],
        direction: sort[1] === -1 ? 'ascending' : 'descending'
      }));
    }

    if (aggregations && aggregations.length !== 0) {
      if (!args.query2) args.query2 = {};
      args.query2.aggregations = aggregations;
    }

    if (filters && filters.length !== 0) {
      if (!args.query2) args.query2 = {};
      args.query2.filter = {
        operator: 'and',
        filters: filters.map((filter) => ({
          property: filter[0],
          filter: {
            operator: filter[1],
            value: {
              type: filter[2],
              value: filter[3]
            }
          }
        }))
      };
    }

    if (properties && properties.length !== 0) {
      args.format = { [`${this.view_data.type}_wrap`]: true };
      args.format[`${this.view_data.type}_properties`] = properties;
    }

    // ? Respect previous filters and sorts
    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      this.createTransaction([[collectionViewUpdate(this.view_data.id, [], args)]]),
      this.headers
    );
  }
}

export default View;
