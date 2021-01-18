import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../../NotionFilter";
import BasicMenu from "../../../../Shared/BasicMenu";
import Svgicon from "../../../../Shared/Svgicon";

interface Props {
  parent_filter: IViewFilter,
  trails: number[]
}

export default function FilterGroupItemOptions({ parent_filter, trails }: Props) {
  const last_trail = trails[trails.length - 1];
  const { filters, setFilters } = useContext(NotionFilterContext)

  return <div className="NotionFilter-Group-Item-Options" style={{ display: "flex", alignItems: "center" }}>
    <BasicMenu items={[
      {
        label: "Remove",
        icon: <Svgicon icon="remove" />,
        onClick() {
          parent_filter.filters.splice(last_trail, 1);
          setFilters({ ...filters })
        }
      },
      {
        label: "Duplicate",
        icon: <Svgicon icon="duplicate" />,
        onClick() {
          parent_filter.filters.push(JSON.parse(JSON.stringify(parent_filter.filters[last_trail])));
          setFilters({ ...filters })
        }
      },
      {
        label: "Turn into group",
        icon: <Svgicon icon="turn_into" />,
        onClick() {
          parent_filter.filters[last_trail] = {
            operator: "and",
            filters: [parent_filter.filters[last_trail]]
          };
          setFilters({ ...filters })
        }
      }
    ]} label={<Svgicon icon="ellipsis" />} />
  </div>
}