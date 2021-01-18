import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../../NotionFilter";
import BasicMenu from "../../../../Shared/BasicMenu";

interface Props {
  parent_filter: IViewFilter,
  trails: number[]
}

const style: React.CSSProperties = { width: "14px", height: "14px", display: "block", fill: "rgb(202, 204, 206)", flexShrink: 0, backfaceVisibility: "hidden", marginRight: "8px" };

export default function FilterGroupItemOptions({ parent_filter, trails }: Props) {
  const last_trail = trails[trails.length - 1];
  const { filters, setFilters } = useContext(NotionFilterContext)

  return <div className="NotionFilter-Group-Item-Options" style={{ display: "flex", alignItems: "center" }}>
    <BasicMenu items={[
      {
        label: "Remove",
        onClick() {
          parent_filter.filters.splice(last_trail, 1);
          setFilters({ ...filters })
        }
      },
      {
        label: "Duplicate",
        onClick() {
          parent_filter.filters.push(JSON.parse(JSON.stringify(parent_filter.filters[last_trail])));
          setFilters({ ...filters })
        }
      },
      {
        label: "Turn into group",
        onClick() {
          parent_filter.filters[last_trail] = {
            operator: "and",
            filters: [parent_filter.filters[last_trail]]
          };
          setFilters({ ...filters })
        }
      }
    ]} label={<svg viewBox="0 0 13 3" style={style}><g> <path d="M3,1.5A1.5,1.5,0,1,1,1.5,0,1.5,1.5,0,0,1,3,1.5Z"></path> <path d="M8,1.5A1.5,1.5,0,1,1,6.5,0,1.5,1.5,0,0,1,8,1.5Z"></path> <path d="M13,1.5A1.5,1.5,0,1,1,11.5,0,1.5,1.5,0,0,1,13,1.5Z"></path> </g></svg>} />
  </div>
}