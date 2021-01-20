import React, { Fragment } from "react";
import { FilterGroupProps } from "../../../types";
import FilterGroupAdd from "./Add";
import FilterGroupItem from "./Item";
import FilterGroupOperator from "./Operator";
import FilterGroupOptions from "./Options";

export default function FilterGroup(props: FilterGroupProps) {
  const { filter, trails } = props;
  const last_trail = trails[trails.length - 1];
  return <Fragment>
    {filter.filters.length !== 0 ?
      <div className="NotionFilter-Group-items">
        {filter.filters.map((child_filter, index) =>
          <FilterGroupItem
            group_operator_element={index === 0 && trails.length !== 0 && props.parent_filter && (last_trail === 1 ? <FilterGroupOperator filter={props.parent_filter} /> : <div className="NotionFilter-Group-Operator NotionFilter-Group-Operator--text">{props.parent_filter.operator[0].toUpperCase() + props.parent_filter.operator.slice(1)}</div>)}
            parent_filter={filter}
            key={index}
            filter={child_filter}
            trails={trails.concat(index)}
            group_options_element={trails.length !== 0 && index === 0 ? <FilterGroupOptions {...props} /> : null}
          />)}
      </div>
      : null}
    <FilterGroupAdd {...props} />
  </Fragment>
}