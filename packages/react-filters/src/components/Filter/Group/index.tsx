import React from "react";
import { FilterGroupProps } from "../../../types";
import FilterGroupAdd from "./Add";
import FilterGroupItem from "./Item";
import FilterGroupOperator from "./Operator";
import FilterGroupOptions from "./Options";

export default function FilterGroup(props: FilterGroupProps) {
  const { filter, trails } = props;
  return <div className="NotionFilter-Group">
    {filter.filters.length !== 0 ? <div style={{ display: "flex", border: "1px solid black", padding: "10px" }}>
      <FilterGroupOperator filter={filter} />
      <div className="NotionFilter-Group-Items">
        {filter.filters.map((child_filter, index) => <FilterGroupItem parent_filter={filter} key={index} filter={child_filter} trails={trails.concat(index)} />)}
      </div>
      {trails.length !== 0 && <FilterGroupOptions {...props} />}
    </div> : <div>No Filters Added</div>}
    <FilterGroupAdd {...props} />
  </div>
}