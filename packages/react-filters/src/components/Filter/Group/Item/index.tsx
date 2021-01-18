import { IViewFilter, TViewFilters } from "@nishans/types";
import React, { useContext } from "react";
import FilterGroup from "..";
import { NotionFilterContext } from "../../../../NotionFilter";
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
  const { schema } = useContext(NotionFilterContext)

  if ((filter as IViewFilter).operator) return <FilterGroup filter={filter as IViewFilter} trails={trails} />
  const schema_unit = schema[(filter as TViewFilters).property];
  const filter_info = getFilterInfo(schema_unit.type);

  return <div className="NotionFilter-Group-Item" style={{ display: "flex", border: "2px solid black" }}>
    <FilterGroupItemProperty filter={filter as TViewFilters} />
    <FilterGroupItemOperator operators={filter_info} filter={filter as TViewFilters} />
    <FilterGroupItemValue value="string" />
    <FilterGroupItemOptions parent_filter={parent_filter} trails={trails} />
  </div>
}
