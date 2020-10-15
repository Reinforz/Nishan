import axios from "axios";

import Nishan from "../Nishan";

import { collectionViewUpdate } from '../utils/chunk';

import { TView, ViewAggregations, ViewFormatProperties } from "../types";

class View extends Nishan {
  parent_id: string;
  view_data: TView;

  constructor({
    token,
    interval,
    user_id,
    shard_id,
    space_id,
    parent_id,
    view_data
  }: {
    parent_id: string,
    view_data: TView,
    token: string,
    interval: number,
    user_id: string,
    shard_id: number,
    space_id: string
  }) {
    super({
      token,
      interval,
      user_id,
      shard_id,
      space_id,
    })
    this.parent_id = parent_id;
    this.view_data = view_data;
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
