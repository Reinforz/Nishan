import axios from "axios";

import { collectionViewUpdate } from '../utils/chunk';
import Getters from "./Getters";
import { NishanArg, TView, ViewAggregations, ViewFormatProperties } from "../types";

class View extends Getters {
  parent_id: string;
  view_data: TView;

  constructor(arg: NishanArg & {
    parent_id: string,
    view_data: TView,
  }) {
    super(arg);
    this.parent_id = arg.parent_id;
    this.view_data = arg.view_data;
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
