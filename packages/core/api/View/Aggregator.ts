import { ITableView, IBoardView, ITimelineView } from "@nishans/types";
import { NishanArg, UserViewAggregationsCreateParams, UpdateType, UpdateTypes, FilterType, FilterTypes, ISchemaAggregationMapValue } from "../../types";
import { getAggregationsMap, getSchemaMap, Operation } from "../../utils";
import View from "./View";

/**
 * A class to represent the aggregrator methods for views that supports it
 * @noInheritDoc
 */
class Aggregator<T extends ITableView | IBoardView | ITimelineView> extends View<T> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }

  async createAggregation(arg: UserViewAggregationsCreateParams) {
    await this.createAggregations([arg])
  }

  async createAggregations(args: UserViewAggregationsCreateParams[]) {
    const data = this.getCachedData(), schema_map = getSchemaMap(this.getCollection()), [, aggregations] = getAggregationsMap(this.getCachedData(), this.getCollection());
    for (let index = 0; index < args.length; index++) {
      const { aggregator, name } = args[index];
      // ? FIX:1:E Warning if schema_map.get(name) returns undefined
      aggregations.push({
        property: schema_map.get(name)?.schema_id ?? name,
        aggregator
      })
    };

    this.stack.push(Operation.collection_view.update(this.id, [], {
      query2: data.query2,
    }))
  }

  async updateAggregation(arg: UpdateType<ISchemaAggregationMapValue, Omit<UserViewAggregationsCreateParams, "name">>) {
    await this.updateAggregations(typeof arg === "function" ? arg : [arg],  false);
  }

  async updateAggregations(args: UpdateTypes<ISchemaAggregationMapValue, Omit<UserViewAggregationsCreateParams, "name">>, multiple?: boolean) {
    const data = this.getCachedData(), [aggregations_map, aggregations] = getAggregationsMap(this.getCachedData(), this.getCollection());
    await this.updateIterate<ISchemaAggregationMapValue, Omit<UserViewAggregationsCreateParams, "name">>(args, {
      child_ids: Object.keys(aggregations_map),
      child_type: "collection_view",
      manual: true,
      multiple
    }, (name) => aggregations_map.get(name), (_, original_data, updated_data) => {
      const aggregation = aggregations[aggregations.findIndex(data => data.property === original_data.schema_id)], { aggregator } = updated_data;
      aggregation.aggregator = aggregator;
    })

    this.stack.push(Operation.collection_view.update(this.id, [], {
      query2: data.query2,
    }))
  }

  async deleteAggregation(arg: FilterType<ISchemaAggregationMapValue>) {
    await this.deleteAggregations(typeof arg === "string" ? [arg] : arg,  false);
  }

  async deleteAggregations(args: FilterTypes<ISchemaAggregationMapValue>, multiple?: boolean) {
    const [aggregations_map, aggregations] = getAggregationsMap(this.getCachedData(), this.getCollection()), data = this.getCachedData();
    await this.deleteIterate<ISchemaAggregationMapValue>(args, {
      child_type: "collection_view",
      multiple,
      child_ids: Object.keys(aggregations_map),
      manual: true
    }, (name) => aggregations_map.get(name), (_, aggregation) => {
      aggregations.splice(aggregations.findIndex(data => data.property === aggregation.schema_id), 1)
    })
    this.stack.push(Operation.collection_view.update(this.id, [], {
      query2: data.query2
    }))
  }
}

export default Aggregator;