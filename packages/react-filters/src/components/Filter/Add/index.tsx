import React from "react";
import { BasicSelect } from "../../Shared";

interface Props {
  addFilter: React.Dispatch<React.SetStateAction<number>>
}

export default function FilterAdd(props: Props) {
  return <div >
    <BasicSelect label={"Add a filter"} value={""} onChange={(e) => {
      switch (e.target.value) {
        case "filter":
          props.addFilter(current_filters => current_filters + 1)
          break;
        case "filter_group":
          props.addFilter(current_filters => current_filters + 1)
          break;
      }
    }} items={[{ label: "Add a filter", value: "filter" }, { label: "Add a filter group", value: "filter_group" }]} />
  </div>
}