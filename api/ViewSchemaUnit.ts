import Data from "./Data";
import { TView, NishanArg, ViewFormatProperties, ViewSorts, Predicate, TViewAggregationsAggregators, TViewFiltersOperator, IViewFilter, TViewFiltersType, TViewFilters } from "../types";
import { warn } from "../utils";

/**
 * A class to represent a column schema of a collection and a view
 * @noInheritDoc
 */

export default class ViewSchemaUnit extends Data<TView> {
  schema_id: string;

  constructor(arg: NishanArg & { schema_id: string }) {
    super({ ...arg, type: "collection_view" });
    this.schema_id = arg.schema_id
  }

  async update(arg: Partial<Omit<ViewFormatProperties, "property">>) {
    const data = this.getCachedData(), container = data.format[`${data.type}_properties` as never] as ViewFormatProperties[];
    this.saveTransactions([this.updateOp([], {
      format: {
        ...data.format,
        [`${data.type}_properties`]: container.map(properties => properties.property === this.schema_id ? { ...properties, ...arg } : properties)
      }
    })])
    this.updateCacheManually(this.id);
  }

  async toggleHide(should_hide?: boolean) {
    const data = this.getCachedData(), container = data.format[`${data.type}_properties` as never] as ViewFormatProperties[];
    this.saveTransactions([this.updateOp([], {
      format: {
        ...data.format,
        [`${data.type}_properties`]: container.map(properties => properties.property === this.schema_id ? { ...properties, visible: should_hide ?? (!properties.visible) } : properties)
      }
    })])
    this.updateCacheManually(this.id);
  }

  async createSort(direction: "ascending" | "descending" = "ascending") {
    await this.createSorts([direction]);
  }

  async createSorts(directions: ("ascending" | "descending")[]) {
    const data = this.getCachedData(), container = data?.query2?.sort ?? [];
    directions.forEach(direction => container.push({ property: this.schema_id, direction }));
    this.saveTransactions([this.updateOp([], {
      query2: {
        ...data.query2,
        sort: container
      }
    })])
    this.updateCacheManually(this.id);
  }

  async updateSort(arg: ((T: ViewSorts) => Promise<ViewSorts>)) {
    await this.updateSorts(arg, false);
  }

  async updateSorts(args: ((T: ViewSorts) => Promise<ViewSorts>), multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), container = data?.query2?.sort ?? [];
    let matched = 0;
    for (let index = 0; index < container.length; index++) {
      const sort = container[index];
      if (sort.property === this.schema_id) {
        const res = await args(sort);
        if (res) {
          container[index] = res;
          matched++;
        }
      }
      if (!multiple && matched !== 0) break;
    }

    this.saveTransactions([this.updateOp([], {
      query2: {
        ...data.query2,
        sort: container
      }
    })])
    this.updateCacheManually(this.id);
  }

  async deleteSort(arg: Predicate<ViewSorts>) {
    await this.deleteSorts(arg, false);
  }

  async deleteSorts(args: undefined | Predicate<ViewSorts>, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), container: ViewSorts[] = data.query2?.sort ?? [];
    let total_deleted = 0;
    if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < container.length; index++) {
        const should_remove = container[index].property === this.schema_id && typeof args === "function" ? await args(container[index], index) : true;
        if (should_remove) {
          delete container[index];
          total_deleted++;
        }
        if (!multiple && total_deleted === 1) break;
      }
    }

    this.saveTransactions([this.updateOp([], {
      query2: {
        ...data.query2,
        sort: container.filter(sort => sort)
      }
    })])
    this.updateCacheManually(this.id);
  }

  async createFilter(filter: [TViewFiltersOperator, TViewFiltersType, string]) {
    await this.createFilters([filter])
  }

  async createFilters(filters: [TViewFiltersOperator, TViewFiltersType, string][]) {
    const data = this.getCachedData(), container = data?.query2?.filter ?? { operator: "and", filters: [] as TViewFilters[] } as IViewFilter;
    if (!container.filters) container.filters = [] as TViewFilters[]

    filters.forEach(filter => {
      if (filter[0] == "is_empty" || filter[0] == "is_not_empty")
        container.filters.push({
          property: this.schema_id,
          filter: {
            operator: filter[0],
          }
        })
      else
        container.filters.push({
          property: this.schema_id,
          filter: {
            operator: filter[0] as any,
            value: {
              type: filter[1] as any,
              value: filter[2]
            }
          }
        })
    });
    this.saveTransactions([this.updateOp([], {
      query2: {
        ...data.query2,
        filter: container
      }
    })])
    this.updateCacheManually(this.id);
  }

  async updateFilter(arg: ((T: TViewFilters) => Promise<TViewFilters>)) {
    await this.updateFilters(arg, false);
  }

  async updateFilters(args: ((T: TViewFilters) => Promise<TViewFilters>), multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), container = data?.query2?.filter ?? { operator: "and", filters: [] as TViewFilters[] };
    let matched = 0;
    for (let index = 0; index < container.filters.length; index++) {
      const filter = container.filters[index] as any;
      if (filter.property === this.schema_id) {
        const res = await args(filter);
        if (res) {
          container.filters[index] = res;
          matched++;
        }
      }
      if (!multiple && matched !== 0) break;
    }

    this.saveTransactions([this.updateOp([], {
      query2: {
        ...data.query2,
        filter: container
      }
    })])
    this.updateCacheManually(this.id);
  }

  async deleteFilter(arg: Predicate<TViewFilters>) {
    await this.deleteFilters(arg, false)
  }

  async deleteFilters(args: undefined | Predicate<TViewFilters>, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), container = data.query2?.filter ?? { operator: "and", filters: [] } as any;
    let total_deleted = 0;
    if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < container.filters.length; index++) {
        const should_remove = container.filters[index].property === this.schema_id && (typeof args === "function" ? await args(container.filters[index], index) : true);
        if (should_remove) {
          delete container.filters[index];
          total_deleted++;
        }
        if (!multiple && total_deleted === 1) break;
      }
    }

    this.saveTransactions([this.updateOp([], {
      query2: {
        ...data.query2,
        filter: {
          operator: "and",
          filters: container.filters.filter((filter: any) => filter)
        }
      }
    })])
    this.updateCacheManually(this.id);
  }

  async createAggregator(aggregator: TViewAggregationsAggregators) {
    const data = this.getCachedData();
    if (data.type === "table" || data.type === "board" || data.type === "timeline") {
      const container = data?.query2?.aggregations ?? [],
        does_already_contain = container.find(aggregator => aggregator.property === this.schema_id);
      if (!does_already_contain) {
        container.push({ property: this.schema_id, aggregator })
        this.saveTransactions([this.updateOp([], {
          query2: {
            ...data.query2,
            aggregations: container
          }
        })])
        this.updateCacheManually(this.id);
      } else
        warn(`ViewSchemaUnit:${this.schema_id} already contains an aggregrator`)
    }
  }

  async updateAggregrator(aggregator: TViewAggregationsAggregators) {
    const data = this.getCachedData();
    if (data.type === "table" || data.type === "board" || data.type === "timeline") {
      const container = data?.query2?.aggregations ?? [],
        target_aggregrator = container.find(aggregator => aggregator.property === this.schema_id) ?? { property: this.schema_id, aggregator: "count" };
      if (!target_aggregrator)
        container.push({ property: this.schema_id, aggregator })
      else
        target_aggregrator.aggregator = aggregator;

      this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2,
          aggregations: container
        }
      })])
      this.updateCacheManually(this.id);
    }
  }

  async deleteAggregrator() {
    const data = this.getCachedData();
    if (data.type === "table" || data.type === "board" || data.type === "timeline") {
      const container = data?.query2?.aggregations ?? [];
      this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2,
          aggregations: container.filter(aggregrator => aggregrator.property !== this.schema_id)
        }
      })])
      this.updateCacheManually(this.id);
    }
  }
}