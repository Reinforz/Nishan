import { TViewFiltersOperator, TViewFiltersValue } from "@nishans/types";
import React from "react";
import { TSchemaInfo } from "../../../../types";
import { BasicSelect } from "../../../Shared";

interface Props {
  schema: TSchemaInfo
}

interface FilterOperator {
  operator: TViewFiltersOperator,
  label: string,
  value: TViewFiltersValue
}

export default function FilterGroupItem(props: Props) {
  return <div className="NotionFilter-Group-Item">
    <BasicSelect label="Group Operator" value={'and'} onChange={() => { }} items={[{ label: "And", value: 'and' }, { label: "Or", value: 'or' }]} />
    <BasicSelect label="Property" value={'and'} onChange={() => { }} items={props.schema.map(unit => ({ label: unit[2], value: unit[1] }))} />
    <span>Operator</span>
    <span>Value</span>
  </div>
}
