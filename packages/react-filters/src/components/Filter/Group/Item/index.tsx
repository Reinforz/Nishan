import { IViewFilter, TViewFilters } from "@nishans/types";
import React from "react";
import FilterGroup from "..";
import { getFilterInfo } from "../../../../utils/getFilterInfoFromSchemaUnit";
import FilterGroupItemOperator from "./Operator";
import FilterGroupItemOptions from "./Options";
import FilterGroupItemProperty from "./Property";
import FilterGroupItemValue from "./Value";

interface Props {
  parent_filter: IViewFilter,
  filter: IViewFilter | TViewFilters,
  trails: number[]
}

export default function FilterGroupItem({ parent_filter, filter, trails }: Props) {
  if ((filter as IViewFilter).operator) return <FilterGroup filter={filter as IViewFilter} trails={trails} />
  return <div className="NotionFilter-Group-Item" style={{ display: "flex", border: "2px solid black" }}>
    <FilterGroupItemProperty filter={filter as TViewFilters} />
    <FilterGroupItemOperator operators={[{ value: "checkbox_is", label: "Is" }]} />
    <FilterGroupItemValue value="string" />
    <FilterGroupItemOptions parent_filter={parent_filter} trails={trails} />
  </div>
}
