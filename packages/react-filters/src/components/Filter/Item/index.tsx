import { TSchemaUnitType } from "@nishans/types";
import React from "react";
import { BasicSelect } from "../../Shared";

interface Props {
  schema: [TSchemaUnitType, string, string][]
}

export default function FilterItem(props: Props) {
  return <div>
    <BasicSelect label="Group Operator" value={'and'} onChange={() => { }} items={[{ label: "And", value: 'and' }, { label: "Or", value: 'or' }]} />
    <BasicSelect label="Property" value={'and'} onChange={() => { }} items={props.schema.map(unit => ({ label: unit[2], value: unit[1] }))} />
    <span>Operator</span>
    <span>Value</span>
  </div>
}
