import Data from "../api/Data";
import { IPage, ISpace, IRootPage, UpdateCacheManuallyParam } from "../types";

import Collection from "../api/Collection";
import CollectionView from "../api/CollectionView";
import CollectionViewPage from "../api/CollectionViewPage";
import View from "../api/View";

type Constructor<E extends (IRootPage | IPage) | ISpace, T = Data<E>> = new (...args: any[]) => T;

export default function DBArtifacts<T extends (IRootPage | IPage) | ISpace, TBase extends Constructor<T>>(Base: TBase) {
  return class DBArtifacts extends Base {
    constructor(...args: any[]) {
      super(args[0]);
    }

    async createDBArtifacts(arg: [[string, "collection_view" | "collection_view_page"], string | string[], string[]]) {
      const update_tables: UpdateCacheManuallyParam = [];
      Array.isArray(arg[1]) ? arg[1].forEach(arg => update_tables.push([arg, "collection"])) : update_tables.push([arg[1], "collection"]);
      arg[2].forEach(view_id => update_tables.push([view_id, "collection_view"]));
      update_tables.push(arg[0][0]);

      return {
        [arg[0][1]]: new (arg[0][1] === "collection_view" ? CollectionView : CollectionViewPage)({
          ...this.getProps(),
          id: arg[0][0]
        }),
        collection: Array.isArray(arg[1]) ? arg[1].forEach(id => new Collection({
          id,
          ...this.getProps()
        })) : new Collection({
          id: arg[1],
          ...this.getProps()
        }),
        collection_views: arg[2].map(view_id => new View({ id: view_id, ...this.getProps() }))
      }
    }
  }
}
