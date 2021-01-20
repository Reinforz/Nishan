import { TViewFilters, TViewFiltersOperator } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../../NotionFilter";
import { BasicSelect } from "../../../../Shared";

interface Props {
  operators: {
    value: TViewFiltersOperator,
    label: string
  }[],
  filter: TViewFilters
}

export default function FilterGroupItemOperator({ operators, filter }: Props) {
  const { dispatch } = useContext(NotionFilterContext)

  return <div className="NotionFilter-Group-Item-Operator NotionFilter-Group-Item-item">
    <BasicSelect label={"Filter Operator"} onChange={(e) => {
      dispatch({ type: "CHANGE_OPERATOR", filter, operator: e.target.value as any })
    }} items={operators} value={filter.filter.operator} />
  </div>
}