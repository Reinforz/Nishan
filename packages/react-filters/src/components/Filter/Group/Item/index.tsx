import { IViewFilter, TViewFilters } from "@nishans/types";
import React from "react";
import FilterGroup from "..";
import { TSchemaInfo } from "../../../../types";
import FilterGroupItemOperator from "./Operator";
import FilterGroupItemOptions from "./Options";
import FilterGroupItemProperty from "./Property";
import FilterGroupItemValue from "./Value";

interface Props {
  schema: TSchemaInfo,
  filter: IViewFilter | TViewFilters,
  trail: number[]
}

export default function FilterGroupItem(props: Props) {
  const { filter } = props;
  if ((filter as IViewFilter).operator) return <FilterGroup trail={props.trail} filters={filter as IViewFilter} schema_info={props.schema} />
  return <div className="NotionFilter-Group-Item">
    <FilterGroupItemProperty schema={props.schema} />
    <FilterGroupItemOperator operators={[{ value: "checkbox_is", label: "Is" }]} />
    <FilterGroupItemValue value="string" />
    <FilterGroupItemOptions />
  </div>
}
