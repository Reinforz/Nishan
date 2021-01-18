import { IViewFilter, TViewFilters } from "@nishans/types";
import React from "react";
import FilterGroup from "..";
import FilterGroupItemOperator from "./Operator";
import FilterGroupItemOptions from "./Options";
import FilterGroupItemProperty from "./Property";
import FilterGroupItemValue from "./Value";

interface Props {
  filter: IViewFilter | TViewFilters,
  trails: number[]
}

export default function FilterGroupItem({ filter, trails }: Props) {
  if ((filter as IViewFilter).operator) return <FilterGroup filter={filter as IViewFilter} trails={trails} />
  return <div className="NotionFilter-Group-Item" style={{ display: "flex", border: "2px solid black" }}>
    <FilterGroupItemProperty />
    <FilterGroupItemOperator operators={[{ value: "checkbox_is", label: "Is" }]} />
    <FilterGroupItemValue value="string" />
    <FilterGroupItemOptions />
  </div>
}
