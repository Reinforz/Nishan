import React from "react";
import { TSchemaInfo } from "../../../../../types";
import { BasicSelect } from "../../../../Shared";

interface Props {
  schema: TSchemaInfo
}

export default function FilterGroupItemProperty(props: Props) {
  return <div className="NotionFilter-Group-Item-Property">
    <BasicSelect label="Property" value={'and'} onChange={() => { }} items={props.schema.map(unit => ({ label: unit[2], value: unit[1] }))} />
  </div>
}