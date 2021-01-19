import React, { Fragment } from "react";
import { FilterGroupProps } from "../../../types";
import FilterGroupAdd from "./Add";
import FilterGroupItem from "./Item";
import FilterGroupOptions from "./Options";

export default function FilterGroup(props: FilterGroupProps) {
  const { filter, trails } = props;
  return <Fragment>
    {filter.filters.length !== 0 ? <Fragment>
      {filter.filters.map((child_filter, index) => <FilterGroupItem parent_filter={filter} key={index} filter={child_filter} trails={trails.concat(index)} />)}
      {trails.length !== 0 && <FilterGroupOptions {...props} />}
    </Fragment> : <div>No Filters Added</div>}
    <FilterGroupAdd {...props} />
  </Fragment>
}