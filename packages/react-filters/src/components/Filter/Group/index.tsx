import { IViewFilter } from "@nishans/types";
import React from "react";
import FilterGroupAdd from "./Add";
import FilterGroupItem from "./Item";
import FilterGroupOperator from "./Operator";
import FilterGroupOptions from "./Options";

interface Props {
  filter: IViewFilter,
  trails: number[]
}

export default function FilterGroup({ trails, filter }: Props) {
  return <div className="NotionFilter-Group">
    {filter.filters.length !== 0 ? <div style={{ display: "flex", border: "1px solid black", padding: "10px" }}>
      <FilterGroupOperator filter={filter} />
      <div className="NotionFilter-Group-Items">
        {filter.filters.map((child_filter, index) => <FilterGroupItem parent_filter={filter} key={index} filter={child_filter} trails={trails.concat(index)} />)}
      </div>
      <FilterGroupOptions />
    </div> : <div>No Filters Added</div>}
    <FilterGroupAdd filter={filter} />
  </div>
}