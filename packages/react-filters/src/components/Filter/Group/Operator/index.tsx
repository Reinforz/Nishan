import { IViewFilter, TViewGroupFilterOperator } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../NotionFilter";
import { convertIntoSelectMenuItems } from "../../../../utils/convertIntoSelectMenuItem";

import { BasicSelect } from "../../../Shared";

interface Props {
  filter: IViewFilter,
}

export default function FilterGroupOperator({ filter }: Props) {
  const { filters, setFilters } = useContext(NotionFilterContext)
  return <div className="NotionFilter-Group-Operator">
    <BasicSelect label="Group Operator" value={filter.operator} onChange={(e) => {
      filter.operator = e.target.value as TViewGroupFilterOperator;
      setFilters({ ...filters })
    }} items={convertIntoSelectMenuItems(["And", "Or"])} />
  </div>
}