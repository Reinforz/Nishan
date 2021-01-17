import { IViewFilter } from "@nishans/types";
import React from "react";
import { TSchemaInfo } from "../../../types";
import FilterGroupAdd from "./Add";
import FilterGroupItem from "./Item";
import FilterGroupOperator from "./Operator";
import FilterGroupOptions from "./Options";

interface Props {
  filters: IViewFilter,
  schema_info: TSchemaInfo;
}

export default function FilterGroup(props: Props) {
  return <div className="NotionFilter-Group">
    <FilterGroupOperator />
    <div className="NotionFilter-Group-Items">
      {props.filters.filters.map(() => <FilterGroupItem schema={props.schema_info} />)}
    </div>
    <FilterGroupOptions />
    <FilterGroupAdd addFilter={() => { }} />
  </div>
}