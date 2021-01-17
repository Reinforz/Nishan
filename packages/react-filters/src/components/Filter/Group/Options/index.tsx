import React from "react";
import { BasicSelect } from "../../../Shared";

export default function FilterGroupOptions() {
  return <div className="NotionFilter-Group-Options">
    <BasicSelect value="" onChange={() => { }} label="Options" items={[{ label: "Remove", value: "remove" }, { label: "Duplicate", value: "duplicate" }, { label: "Turn into filter", value: "turn_into_filter" }, { label: "Wrap into group", value: "wrap_into_group" }]} />
  </div>
}