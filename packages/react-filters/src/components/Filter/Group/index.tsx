import { IViewFilter, TSchemaUnitType } from "@nishans/types";
import React from "react";
import FilterGroupItem from "./Item";

interface Props {
  filters: IViewFilter,
  schema_info: [TSchemaUnitType, string, string][];
}

export default function FilterGroup(props: Props) {
  return <div className="NotionFilter-Group">
    {props.filters.filters.map(() => <FilterGroupItem schema={props.schema_info} />)}
  </div>
}