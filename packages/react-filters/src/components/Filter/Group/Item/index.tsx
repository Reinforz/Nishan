import { IViewFilter, TViewFilters } from "@nishans/types";
import React, { useContext } from "react";
import FilterGroup from "..";
import { NotionFilterContext } from "../../../../NotionFilter";
import { getFilterInfo } from "../../../../utils/getFilterInfoFromSchemaUnit";
import FilterGroupItemOperator from "./Operator";
import FilterGroupItemOptions from "./Options";
import FilterGroupItemProperty from "./Property";
import FilterGroupItemValue from "./Value";
import FilterGroupOperator from "../Operator"

interface Props {
  parent_filter: IViewFilter,
  filter: IViewFilter | TViewFilters,
  trails: number[],
  group_options_element: JSX.Element | null
}

export default function FilterGroupItem({ group_options_element, parent_filter, filter, trails }: Props) {
  const { schema } = useContext(NotionFilterContext)
  const last_trail = trails[trails.length - 1];
  if ((filter as IViewFilter).operator) return <FilterGroup parent_filter={parent_filter} filter={filter as IViewFilter} trails={trails} />

  const schema_unit = schema[(filter as TViewFilters).property],
    filter_infos = getFilterInfo(schema_unit);

  return <div className="NotionFilter-Group-Item">
    {last_trail === 0 ? <div className="NotionFilter-Group-Operator NotionFilter-Group-Operator--text">Where</div> : last_trail === 1 ? <FilterGroupOperator filter={parent_filter} /> : <div className="NotionFilter-Group-Operator NotionFilter-Group-Operator--text">{parent_filter.operator[0].toUpperCase() + parent_filter.operator.slice(1)}</div>}
    <FilterGroupItemProperty filter={filter as TViewFilters} />
    <FilterGroupItemOperator operators={(filter_infos as any).map((filter_info: any) => ({ value: filter_info.operator, label: filter_info.label }))} filter={filter as TViewFilters} />
    <FilterGroupItemValue type={schema_unit.type} value={(filter_infos as any).find((filter_info: any) => filter_info.operator === (filter as TViewFilters).filter.operator)?.value ?? null} />
    <FilterGroupItemOptions parent_filter={parent_filter} trails={trails} />
    {group_options_element}
  </div>
}
