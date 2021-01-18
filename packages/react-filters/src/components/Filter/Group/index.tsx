import { IViewFilter } from "@nishans/types";
import React from "react";
import FilterGroupAdd from "./Add";
import FilterGroupItem from "./Item";
import FilterGroupOperator from "./Operator";
import FilterGroupOptions from "./Options";

interface Props {
  filter: IViewFilter
}

export default function FilterGroup({ filter }: Props) {
  return <div className="NotionFilter-Group">
    {filter.filters.length !== 0 ? <div style={{ display: "flex" }}>
      <FilterGroupOperator />
      <div className="NotionFilter-Group-Items">
        {filter.filters.map((filter, index) => <FilterGroupItem key={index} filter={filter} />)}
      </div>
      <FilterGroupOptions />
    </div> : <div>No Filters Added</div>}
    <FilterGroupAdd filter={filter} />
  </div>
}