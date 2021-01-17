import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";
import FilterGroup from "..";
import { NotionFilterContext } from "../../../../NotionFilter";
import { extractNestedFilter } from "../../../../utils/extractNestedFilter";
import FilterGroupItemOperator from "./Operator";
import FilterGroupItemOptions from "./Options";
import FilterGroupItemProperty from "./Property";
import FilterGroupItemValue from "./Value";

interface Props {
  trails: number[]
}

export default function FilterGroupItem(props: Props) {
  const { filters } = useContext(NotionFilterContext);
  const filter = extractNestedFilter(filters.filters, props.trails);
  if ((filter as IViewFilter).operator) return <FilterGroup trails={props.trails} />
  return <div className="NotionFilter-Group-Item">
    <FilterGroupItemProperty />
    <FilterGroupItemOperator operators={[{ value: "checkbox_is", label: "Is" }]} />
    <FilterGroupItemValue value="string" />
    <FilterGroupItemOptions />
  </div>
}
