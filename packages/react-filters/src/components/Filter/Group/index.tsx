import React, { Fragment } from "react";
import { FilterGroupProps } from "../../../types";
import FilterGroupAdd from "./Add";
import FilterGroupItem from "./Item";
import FilterGroupOptions from "./Options";

export default function FilterGroup(props: FilterGroupProps) {
  const { filter, trails } = props, color = 255 - (trails.length + 1) * 5;
  return <Fragment>
    {filter.filters.length !== 0 ?
      <div className="NotionFilter-Group-items" style={{ left: 100 * (trails.length), backgroundColor: `rgb(${color}, ${color}, ${color})` }}>
        {filter.filters.map((child_filter, index) => <FilterGroupItem parent_filter={filter} key={index} filter={child_filter} trails={trails.concat(index)} group_options_element={trails.length !== 0 && index === 0 ? <FilterGroupOptions {...props} /> : null} />)}
      </div>
      : null}
    <FilterGroupAdd {...props} />
  </Fragment>
}