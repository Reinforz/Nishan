import { IBoardView, ICollection, ITableView, ITimelineView, NishanArg, TCollectionBlock, TSchemaUnit, TViewAggregationsAggregators, UserViewAggregationsCreateParams, ViewAggregations } from "../../types";
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

  async updateAggregation(cb: (T: TSchemaUnit & ViewAggregations) => TViewAggregationsAggregators | undefined) {
    await this.updateAggregations(cb, false);
  }

  async updateAggregations(cb: (T: TSchemaUnit & ViewAggregations) => TViewAggregationsAggregators | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    if (!data.query2) data.query2 = { aggregations: [] as ViewAggregations[] } as any;
    if (!data.query2?.aggregations) (data.query2 as any).aggregations = [] as ViewAggregations[];
    let total_updated = 0;
    const aggregations = data.query2?.aggregations as ViewAggregations[];
    const schema_entries = new Map(Object.entries(collection.schema));
    for (let index = 0; index < aggregations.length; index++) {
      const aggregation = aggregations[index], schema = schema_entries.get(aggregation.property);
      const res = cb({ ...schema, ...aggregation } as any) ?? undefined;
      if (res) {
        total_updated++;
        const aggregator = res;
        aggregations[index] = {
          property: aggregation.property,
          aggregator
        }
      }
      if (!multiple && total_updated === 1) break;
    }

    if (total_updated) {
      await this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2
        }
      })]);
      await this.updateCacheManually(this.id);
    }
  }

  async deleteAggregation(cb: (T: TSchemaUnit & ViewAggregations) => boolean | undefined) {
    await this.deleteAggregations(cb, false);
  }

  async deleteAggregations(cb: (T: TSchemaUnit & ViewAggregations) => boolean | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    let total_deleted = 0;
    const aggregations = data.query2?.aggregations as ViewAggregations[];
    const schema_entries = new Map(Object.entries(collection.schema));

    for (let index = 0; index < aggregations.length; index++) {
      const aggregation = aggregations[index] as ViewAggregations;
      const schema = schema_entries.get(aggregation.property)
      const should_delete = cb({ ...aggregation, ...schema } as any) ?? undefined;
      if (should_delete) {
        total_deleted++;
        aggregations.splice(index, 1)
      }
      if (!multiple && total_deleted === 1) break;
    }

    if (total_deleted) {
      await this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2
        }
      })]);
      await this.updateCacheManually(this.id);
    }
  }
}

export default Aggregator;