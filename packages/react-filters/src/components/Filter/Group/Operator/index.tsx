import React from "react";
import { BasicSelect } from "../../../Shared";

export default function FilterGroupOperator() {
  return <div className="NotionFilter-Group-Operator">
    <BasicSelect label="Group Operator" value="and" onChange={() => { }} items={[{
      label: "And",
      value: "and"
    }, {
      label: "Or",
      value: "or"
    }]} />
  </div>
}