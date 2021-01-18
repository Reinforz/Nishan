import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../../NotionFilter";
import { BasicSelect } from "../../../../Shared";

export default function FilterGroupItemProperty() {
  const { schema } = useContext(NotionFilterContext)
  return <div className="NotionFilter-Group-Item-Property">
    <BasicSelect label="Property" value={'and'} onChange={() => { }} items={Object.entries(schema).map(([key, value]) => ({ label: value.name, value: key }))} />
  </div>
}