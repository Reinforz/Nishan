import { Schema, TView, ViewSorts } from "@nishans/types";
import { initializeViewSorts } from "..";
import { ISchemaSortsMap } from "../../src";

export function sorts(data: TView, schema: Schema){
  const sorts_map: ISchemaSortsMap = new Map(), sorts = initializeViewSorts(data);
  ((data.query2 as any).sort as ViewSorts[]).forEach((sort) => {
    const schema_unit = schema[sort.property];
    sorts_map.set(schema_unit.name, {
      ...schema_unit,
      schema_id: sort.property,
      sort: sort.direction
    })
  });

  return [sorts_map, sorts] as const;
}