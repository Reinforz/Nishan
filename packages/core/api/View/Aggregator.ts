import { ITableView, IBoardView, ITimelineView, TCollectionBlock, ICollection, ViewAggregations, TSchemaUnit } from "@nishan/types";
import { NishanArg, UserViewAggregationsCreateParams, UpdateType, UpdateTypes, FilterType, FilterTypes } from "types";
import View from "./View";

/**
 * A class to represent the aggregrator methods for views that supports it
 * @noInheritDoc
 */
class Aggregator<T extends ITableView | IBoardView | ITimelineView> extends View<T> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }

  #getCollection = () => {
    return this.cache.collection.get((this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock).collection_id) as ICollection
  }

  #populateAggregations = () => {
    const data = this.getCachedData();
    if (!data.query2) data.query2 = { aggregations: [] } as any;
    if (data.query2 && !data.query2?.aggregations) data.query2.aggregations = [];
    return (data.query2 as any).aggregations as ViewAggregations[]
  }

  #getSchemaMap = () => {
    const collection = this.#getCollection(), schema_map: Record<string, TSchemaUnit & { property: string }> = {};
    Object.entries(collection.schema).forEach(([property, value]) => {
      schema_map[value.name] = {
        property,
        ...value
      }
    })
    return schema_map;
  }

  #getAggregationsMap = () => {
    const data = this.getCachedData(), collection = this.#getCollection(),
      aggregations_map: Record<string, TSchemaUnit & ViewAggregations> = {}, aggregations = this.#populateAggregations();
    data.query2?.aggregations?.forEach(aggregation => {
      const schema_unit = collection.schema[aggregation.property];
      aggregations_map[schema_unit.name] = {
        ...schema_unit,
        ...aggregation
      }
    });

    return [aggregations_map, aggregations] as const;
  }

  async createAggregation(arg: UserViewAggregationsCreateParams, execute?: boolean) {
    await this.createAggregations([arg], execute)
  }

  async createAggregations(args: UserViewAggregationsCreateParams[], execute?: boolean) {
    const data = this.getCachedData(), schema_map = this.#getSchemaMap(), [, aggregations] = this.#getAggregationsMap();
    for (let index = 0; index < args.length; index++) {
      const { aggregator, name } = args[index];
      aggregations.push({
        property: schema_map[name].property,
        aggregator
      })
    };

    this.executeUtil([this.updateOp([], {
      query2: data.query2,
    })], this.id, execute)
  }

  async updateAggregation(arg: UpdateType<TSchemaUnit & ViewAggregations, Omit<UserViewAggregationsCreateParams, "name">>, execute?: boolean) {
    await this.updateAggregations(typeof arg === "function" ? arg : [arg], execute, false);
  }

  async updateAggregations(args: UpdateTypes<TSchemaUnit & ViewAggregations, Omit<UserViewAggregationsCreateParams, "name">>, execute?: boolean, multiple?: boolean) {
    const data = this.getCachedData(), [aggregations_map, aggregations] = this.#getAggregationsMap();
    await this.updateIterate<TSchemaUnit & ViewAggregations, Omit<UserViewAggregationsCreateParams, "name">>(args, {
      child_ids: Object.keys(aggregations_map),
      subject_type: "View",
      execute,
      multiple
    }, (name) => aggregations_map[name], (_, original_data, updated_data) => {
      const index = aggregations.findIndex(data => data.property === original_data.property), aggregation = aggregations[index], { aggregator } = updated_data;
      aggregation.aggregator = aggregator
    })

    this.executeUtil([this.updateOp([], {
      query2: data.query2,
    })], this.id, execute)
  }

  async deleteAggregation(arg: FilterType<TSchemaUnit & ViewAggregations>, execute?: boolean) {
    await this.deleteAggregations(typeof arg === "string" ? [arg] : arg, execute, false);
  }

  async deleteAggregations(args: FilterTypes<TSchemaUnit & ViewAggregations>, execute?: boolean, multiple?: boolean) {
    const [aggregations_map, aggregations] = this.#getAggregationsMap(), data = this.getCachedData();

    await this.getIterate<TSchemaUnit & ViewAggregations>(args, {
      subject_type: "View",
      method: "DELETE",
      multiple,
      child_ids: Object.keys(aggregations_map)
    }, (name) => aggregations_map[name], (_, aggregation) => {
      aggregations.splice(aggregations.findIndex(data => data.property === aggregation.property))
    })
    await this.executeUtil([this.updateOp([], {
      query2: data.query2
    })], this.id, execute)
  }
}

export default Aggregator;