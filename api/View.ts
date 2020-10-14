import axios from "axios";
const { collectionViewUpdate } = require('../CollectionView/utils');

import Transaction from "./Transaction"

const { warn, error } = require('../../utils/logs');

class View {
  constructor(obj) {
    Object.entries(obj).forEach(([key, value]) => (this[key] = value));
  }

  static setStatic(obj) {
    Object.entries(obj).forEach(([key, value]) => (View[key] = value));
    return View;
  }

  async update(options) {
    const { sorts = [], filters = [], properties = [], aggregations = [] } = options;
    const args = {};
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
      Transaction.createTransaction([[collectionViewUpdate(this.view_data.id, [], args)]]),
      View.headers
    );
  }
}

export default View;
