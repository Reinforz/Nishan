import { IViewFilter } from "@nishans/types";
import React from "react";
import { BasicSelect } from "../../Shared";

interface Props {
  addFilter: React.Dispatch<React.SetStateAction<IViewFilter>>
}

const returnEmptyFilter = (): any => ({
  property: "",
  filter: {
    operator: "",
    value: {
      type: "",
      value: ""
    }
  }
})

const returnEmptyFilterGroup = (): any => ({
  filters: [],
  operator: "and"
})

export default function FilterAdd(props: Props) {
  return <div >
    <BasicSelect label={"Add a filter"} value={""} onChange={(e) => {
      switch (e.target.value) {
        case "filter":
          props.addFilter(current_filters => {
            current_filters.filters.push(returnEmptyFilter())
            return current_filters;
          })
          break;
        case "filter_group":
          props.addFilter(current_filters => {
            current_filters.filters.push(returnEmptyFilterGroup())
            return current_filters;
          })
          break;
      }
    }} items={[{ label: "Add a filter", value: "filter" }, { label: "Add a filter group", value: "filter_group" }]} />
  </div>
}