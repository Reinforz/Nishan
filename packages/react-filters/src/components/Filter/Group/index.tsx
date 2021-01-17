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
  trail: number[]
}

export default function FilterGroup(props: Props) {
  return <div className="NotionFilter-Group">
    <div style={{ display: "flex" }}>
      <FilterGroupOperator />
      <div className="NotionFilter-Group-Items">
        {props.filters.filters.map((filter, index) => <FilterGroupItem trail={props.trail.concat(index)} filter={filter} schema={props.schema_info} />)}
      </div>
      <FilterGroupOptions />
    </div>
    <FilterGroupAdd />
  </div>
}