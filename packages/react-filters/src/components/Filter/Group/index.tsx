import { IViewFilter } from "@nishans/types";
import React from "react";
import { TSchemaInfo } from "../../../types";
import FilterGroupItem from "./Item";

interface Props {
  filters: IViewFilter,
  schema_info: TSchemaInfo;
}

export default function FilterGroup(props: Props) {
  return <div className="NotionFilter-Group">
    {props.filters.filters.map(() => <FilterGroupItem schema={props.schema_info} />)}
  </div>
}