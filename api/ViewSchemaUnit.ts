import Data from "./Data";
import { TView, NishanArg, ViewFormatProperties, ViewSorts, Predicate, ViewFilters } from "../types";

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
    this.updateCacheManually([this.id]);
  }

  async toggleHide(should_hide?: boolean) {
    const data = this.getCachedData(), container = data.format[`${data.type}_properties` as never] as ViewFormatProperties[];
    this.saveTransactions([this.updateOp([], {
      format: {
        ...data.format,
        [`${data.type}_properties`]: container.map(properties => properties.property === this.schema_id ? { ...properties, visible: should_hide ?? (!properties.visible) } : properties)
      }
    })])
    this.updateCacheManually([this.id]);
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
    this.updateCacheManually([this.id]);
  }

  async updateSort(arg: ((T: ViewSorts) => Promise<ViewSorts>)) {
    await this.updateSorts(arg, false);
  }

  async updateSorts(args: ((T: ViewSorts) => Promise<ViewSorts>), multiple: boolean = true) {
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
    this.updateCacheManually([this.id]);
  }

  async deleteSort(arg: Predicate<ViewSorts>) {
    await this.deleteSorts(arg, false);
  }

  async deleteSorts(args: undefined | Predicate<ViewSorts>, multiple: boolean = true) {
    const data = this.getCachedData(), container: ViewSorts[] = data.query2?.sort as any ?? [];
    const left: ViewSorts[] = []
    if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < container.length; index++) {
        const should_add = container[index].property === this.schema_id && typeof args === "function" ? await args(container[index], index) : true;
        if (!should_add) left.push(container[index])
        if (!multiple && left.length === 1) break;
      }
    }

    this.saveTransactions([this.updateOp([], {
      query2: {
        ...data.query2,
        sort: left
      }
    })])
    this.updateCacheManually([this.id]);
  }

  async createFilter(filter: [string, string, string]) {
    await this.createFilters([filter])
  }

  async createFilters(filters: [string, string, string][]) {
    const data = this.getCachedData(), container = data?.query2?.filter ?? { operator: "and", filters: [] as ViewFilters[] };
    if (!container.filters) container.filters = [] as ViewFilters[]

    filters.forEach(filter => {
      container.filters.push({
        property: this.schema_id,
        filter: {
          operator: filter[0],
          value: {
            type: filter[1],
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
    this.updateCacheManually([this.id]);
  }

  async updateFilter(arg: ((T: ViewFilters) => Promise<ViewFilters>)) {
    await this.updateFilters(arg, false);
  }

  async updateFilters(args: ((T: ViewFilters) => Promise<ViewFilters>), multiple: boolean = true) {
    const data = this.getCachedData(), container = data?.query2?.filter ?? { operator: "and", filters: [] as ViewFilters[] };
    let matched = 0;
    for (let index = 0; index < container.filters.length; index++) {
      const filter = container.filters[index];
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
    this.updateCacheManually([this.id]);
  }
}