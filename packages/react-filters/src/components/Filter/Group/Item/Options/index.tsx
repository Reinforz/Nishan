import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../../NotionFilter";
import { BasicSelect } from "../../../../Shared";

interface Props {
  parent_filter: IViewFilter,
  trails: number[]
}

export default function FilterGroupItemOptions({ parent_filter, trails }: Props) {
  const last_trail = trails[trails.length - 1];
  const { filters, setFilters } = useContext(NotionFilterContext)

  return <div className="NotionFilter-Group-Item-Options">
    <BasicSelect value="" onChange={(e) => {
      switch (e.target.value) {
        case "remove":
          parent_filter.filters.splice(last_trail, 1);
          setFilters({ ...filters })
          break;
        case "duplicate":
          parent_filter.filters.push(parent_filter.filters[last_trail]);
          setFilters({ ...filters })
          break;
        case "turn_into_group":
          parent_filter.filters[last_trail] = {
            operator: "and",
            filters: [parent_filter.filters[last_trail]]
          };
          setFilters({ ...filters })
          break;

      }
    }} label="Options" items={
      [
        { label: "Remove", value: "remove" },
        { label: "Duplicate", value: "duplicate" },
        { label: "Turn into group", value: "turn_into_group" }
      ]
    } />
  </div>
}