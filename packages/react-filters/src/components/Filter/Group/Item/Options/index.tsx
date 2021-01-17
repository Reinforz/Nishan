import React from "react";
import { BasicSelect } from "../../../../Shared";

export default function FilterGroupItemOptions() {
  return <div className="NotionFilter-Group-Item-Options">
    <BasicSelect value="" onChange={() => { }} label="Options" items={[{ label: "Remove", value: "remove" }, { label: "Duplicate", value: "duplicate" }, { label: "Turn into group", value: "turn_into_group" }]} />
  </div>
}