import React from "react";
import { TFilterItemValue } from "../../../../../types";

interface Props {
  value: TFilterItemValue
}

export default function FilterGroupItemValue(props: Props) {
  return <div className="NotionFilter-Group-Item-Value">{props.value}</div>
}