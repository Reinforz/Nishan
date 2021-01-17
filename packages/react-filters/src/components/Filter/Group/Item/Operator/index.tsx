import { TViewFiltersOperator } from "@nishans/types";
import React from "react";
import { BasicSelect } from "../../../../Shared";

interface Props {
  operators: {
    value: TViewFiltersOperator,
    label: string
  }[]
}

export default function FilterGroupItemOperator(props: Props) {
  return <div className="NotionFilter-Group-Item-Operator">
    <BasicSelect label={"Filter Operator"} onChange={() => { }} items={props.operators} value={""} />
  </div>
}