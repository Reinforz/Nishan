import { IBoardView, ICollection, ITableView, ITimelineView, NishanArg, TCollectionBlock, TSchemaUnit, TViewAggregationsAggregators, TViewType, ViewAggregations } from "../../types";
import View from "./View";

class Aggregator<T extends ITableView | IBoardView | ITimelineView> extends View<T> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }

  async createAggregation(cb: (T: TSchemaUnit & { key: string }) => TViewAggregationsAggregators | undefined) {
    await this.createAggregations(cb, false)
  }

  async createAggregations(cb: (T: TSchemaUnit & { key: string }) => TViewAggregationsAggregators | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    if (!data.query2) data.query2 = { aggregations: [] as ViewAggregations[] } as any;
    if (!data.query2?.aggregations) (data.query2 as any).aggregations = [] as ViewAggregations[];
    let total_created = 0;
    const aggregations = data.query2?.aggregations as ViewAggregations[];
    const schema_entries = Object.entries(collection.schema);
    for (let index = 0; index < schema_entries.length; index++) {
      const [key, schema] = schema_entries[index];
      const aggregator = cb({ ...schema, key }) ?? undefined;
      if (aggregator) {
        total_created++;
        aggregations.push({
          property: key,
          aggregator
        })
      }
      if (!multiple && total_created === 1) break;
    }

    if (total_created) {
      await this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2
        }
      })]);
      await this.updateCacheManually([this.id]);
    }
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
      await this.updateCacheManually([this.id]);
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
      await this.updateCacheManually([this.id]);
    }
  }
}

export default Aggregator;