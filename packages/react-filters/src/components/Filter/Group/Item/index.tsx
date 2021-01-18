import { IViewFilter, TViewFilters } from "@nishans/types";
import React from "react";
import FilterGroup from "..";
import FilterGroupItemOperator from "./Operator";
import FilterGroupItemOptions from "./Options";
import FilterGroupItemProperty from "./Property";
import FilterGroupItemValue from "./Value";

interface Props {
  filter: IViewFilter | TViewFilters
}

export default function FilterGroupItem({ filter }: Props) {
  if ((filter as IViewFilter).operator) return <FilterGroup filter={filter as IViewFilter} />
  return <div className="NotionFilter-Group-Item" style={{ display: "flex" }}>
    <FilterGroupItemProperty />
    <FilterGroupItemOperator operators={[{ value: "checkbox_is", label: "Is" }]} />
    <FilterGroupItemValue value="string" />
    <FilterGroupItemOptions />
  </div>
}
