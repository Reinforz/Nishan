import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";

import { NotionFilterContext } from "../../../../NotionFilter";
import { convertIntoSelectMenuItems } from "../../../../utils/convertIntoSelectMenuItem";
import { BasicSelect } from "../../../Shared";

interface Props {
  filter: IViewFilter,
}

export default function FilterGroupOptions({ filter }: Props) {
  const { filters, setFilters } = useContext(NotionFilterContext)

  return <div className="NotionFilter-Group-Options">
    <BasicSelect value="" onChange={(e) => {
      switch (e.target.value) {
        case "remove":
          filter.filters = []
          setFilters({ ...filters })
          break;
        case "duplicate":
          filter.filters.push(JSON.parse(JSON.stringify(filter.filters[filter.filters.length - 1])));
          setFilters({ ...filters })
          break;
      }
    }} label="Options" items={convertIntoSelectMenuItems(["Remove", "Duplicate", "Turn into filter", "Wrap into group"])} />
  </div>
}