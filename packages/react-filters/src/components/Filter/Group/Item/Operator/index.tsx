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
  const { filters, setFilters } = useContext(NotionFilterContext)

  return <div className="NotionFilter-Group-Item-Operator">
    <BasicSelect label={"Filter Operator"} onChange={(e) => {
      filter.filter.operator = e.target.value as any;
      setFilters({ ...filters })
    }} items={operators} value={filter.filter.operator} />
  </div>
}