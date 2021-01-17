import React from "react";
import { TSchemaInfo } from "../../../../types";
import { BasicSelect } from "../../../Shared";
import FilterGroupItemOperator from "./Operator";

interface Props {
  schema: TSchemaInfo
}

export default function FilterGroupItem(props: Props) {
  return <div className="NotionFilter-Group-Item">
    <BasicSelect label="Property" value={'and'} onChange={() => { }} items={props.schema.map(unit => ({ label: unit[2], value: unit[1] }))} />
    <FilterGroupItemOperator operators={[{ value: "checkbox_is", label: "Is" }]} />
    <span>Value</span>
  </div>
}
