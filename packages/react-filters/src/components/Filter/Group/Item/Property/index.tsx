import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../../NotionFilter";
import { BasicSelect } from "../../../../Shared";

export default function FilterGroupItemProperty() {
  const { schema_info } = useContext(NotionFilterContext)
  return <div className="NotionFilter-Group-Item-Property">
    <BasicSelect label="Property" value={'and'} onChange={() => { }} items={schema_info.map(unit => ({ label: unit[2], value: unit[1] }))} />
  </div>
}