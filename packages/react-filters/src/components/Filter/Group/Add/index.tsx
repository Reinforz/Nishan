import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../NotionFilter";
import { convertIntoSelectMenuItems } from "../../../../utils/convertIntoSelectMenuItem";
import { createEmptyFilter, createEmptyFilterGroup } from "../../../../utils/createFilterLiterals";
import { BasicSelect } from "../../../Shared";

interface Props {
  filter: IViewFilter
}

export default function FilterGroupAdd({ filter }: Props) {
  const { filters, setFilters } = useContext(NotionFilterContext);
  return <div className="NotionFilter-Group-Add">
    <BasicSelect label={"Add a filter"} value={""} onChange={(e) => {
      switch (e.target.value) {
        case "add_a_filter":
          filter.filters.push(createEmptyFilter());
          setFilters({ ...filters })
          break;
        case "add_a_filter_group":
          filter.filters.push(createEmptyFilterGroup());
          setFilters({ ...filters })
          break;
      }
    }} items={convertIntoSelectMenuItems(["Add a filter", "Add a filter group"])} />
  </div>
}