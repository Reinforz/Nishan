import { IViewFilter, TViewGroupFilterOperator } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../NotionFilter";
import { convertIntoSelectMenuItems } from "../../../../utils/convertIntoSelectMenuItem";

import { BasicSelect } from "../../../Shared";

interface Props {
  filter: IViewFilter,
}

export default function FilterGroupOperator({ filter }: Props) {
  const { dispatch } = useContext(NotionFilterContext)
  return <div className="NotionFilter-Group-Operator">
    <BasicSelect label="Group Operator" value={filter.operator} onChange={(e) => {
      dispatch({ type: "CHANGE_GROUP_OPERATOR", operator: e.target.value as TViewGroupFilterOperator, filter })
    }} items={convertIntoSelectMenuItems(["And", "Or"])} />
  </div>
}