import { UnknownPropertyReferenceError } from "@nishans/errors";
import { generateSchemaMapFromCollectionSchema } from "@nishans/notion-formula";
import { ICollection, ViewFormatProperties } from "@nishans/types";
import { CreateMaps, populateFilters } from "../../";
import { IViewMap, NishanArg, TViewCreateInput } from "../../../types";
import { generateViewData, populateNonIncludedProperties, populateQuery2SortAndAggregations, populateViewFormat, populateViewProperties, populateViewQuery2 } from "./utils";

export function views(collection: Pick<ICollection, "id" | "schema" | "parent_id">, views: TViewCreateInput[], props: Omit<NishanArg, "id" | "interval">, parent_id?:string) {
  const schema_map = generateSchemaMapFromCollectionSchema(collection.schema), view_ids: string[] = [], view_map = CreateMaps.view();
  const { TableView, ListView, GalleryView, BoardView, CalendarView, TimelineView } = require("../../../src/View/index");
  const view_classes = { table: TableView, list: ListView, gallery: GalleryView, board: BoardView, calendar: CalendarView, timeline: TimelineView };

  for (let index = 0; index < views.length; index++) {
    const view = views[index], 
      { name, type, schema_units} = view, included_units: string[] = [], query2 = populateViewQuery2(view as any, schema_map) , {filter} = query2, format = populateViewFormat(view as any, schema_map), properties: ViewFormatProperties[] = (format as any)[`${view.type}_properties`];

    schema_units.forEach(schema_unit => {
      const { format, name } = schema_unit, schema_map_unit = schema_map.get(name);
      if (schema_map_unit) {
        included_units.push(schema_map_unit.schema_id);
        populateQuery2SortAndAggregations(schema_unit, schema_map_unit, query2)
        properties.push(populateViewProperties(schema_map_unit.schema_id, format))
      } else
        throw new UnknownPropertyReferenceError(name, ['name']);
    })

    properties.push(...populateNonIncludedProperties(type, collection.schema, included_units));

    const input_filters = views[index].filters;
    if(input_filters && filter)
      populateFilters(input_filters, filter.filters, schema_map);

    const view_data = generateViewData({...view, format, query2}, props, parent_id ?? collection.parent_id);
    view_ids.push(view_data.id);
    const view_object = new view_classes[type]({ ...props, id: view_data.id })
    view_map[type].set(view_data.id, view_object);
    view_map[type].set(name, view_object);

    props.logger && props.logger("CREATE", "collection_view", view_data.id);
  }

  return [view_ids, view_map] as [string[], IViewMap];
}