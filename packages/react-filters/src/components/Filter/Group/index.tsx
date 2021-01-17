import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../NotionFilter";
import { extractNestedFilter } from "../../../utils/extractNestedFilter";
import FilterGroupAdd from "./Add";
import FilterGroupItem from "./Item";
import FilterGroupOperator from "./Operator";
import FilterGroupOptions from "./Options";

interface Props {
  trails: number[]
}

export default function FilterGroup(props: Props) {
  const { filters } = useContext(NotionFilterContext)
  const filter = extractNestedFilter(filters.filters, props.trails)
  return <div className="NotionFilter-Group">
    {filter ? <div style={{ display: "flex" }}>
      <FilterGroupOperator />
      <div className="NotionFilter-Group-Items">
        {(filter as IViewFilter).filters.map((_, index) => <FilterGroupItem trails={props.trails.concat(index)} />)}
      </div>
      <FilterGroupOptions />
    </div> : <div>No Filters Added</div>}
    <FilterGroupAdd />
  </div>
}