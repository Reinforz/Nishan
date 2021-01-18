import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";

import { NotionFilterContext } from "../../../../NotionFilter";
import BasicMenu from "../../../Shared/BasicMenu";

interface Props {
  filter: IViewFilter,
}

const style: React.CSSProperties = { width: "14px", height: "14px", display: "block", fill: "rgb(202, 204, 206)", flexShrink: 0, backfaceVisibility: "hidden", marginRight: "8px" };

export default function FilterGroupOptions({ filter }: Props) {
  const { filters, setFilters } = useContext(NotionFilterContext)

  return <div className="NotionFilter-Group-Options" style={{ display: "flex", alignItems: "center" }}>
    <BasicMenu label={<svg viewBox="0 0 13 3" style={style}><g> <path d="M3,1.5A1.5,1.5,0,1,1,1.5,0,1.5,1.5,0,0,1,3,1.5Z"></path> <path d="M8,1.5A1.5,1.5,0,1,1,6.5,0,1.5,1.5,0,0,1,8,1.5Z"></path> <path d="M13,1.5A1.5,1.5,0,1,1,11.5,0,1.5,1.5,0,0,1,13,1.5Z"></path> </g></svg>} items={[
      {
        label: "Remove",
        value: "remove",
        onClick() {
          filter.filters = []
          setFilters({ ...filters })
        }
      },
      {
        label: "Duplicate",
        value: "duplicate",
        onClick() {
          filter.filters.push(JSON.parse(JSON.stringify(filter.filters[filter.filters.length - 1])));
          setFilters({ ...filters })
        }
      }
    ]} />
  </div>
}