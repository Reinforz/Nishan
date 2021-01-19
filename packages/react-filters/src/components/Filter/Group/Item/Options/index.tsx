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
  const { filters, setFilters, nestingLevel, default_group_operator } = useContext(NotionFilterContext)

  return <div className="NotionFilter-Group-Item-Options NotionFilter-Group-Item-item">
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
      nestingLevel > trails.length ? {
        label: "Turn into group",
        icon: <Svgicon icon="turn_into" />,
        onClick() {
          parent_filter.filters[last_trail] = {
            operator: default_group_operator,
            filters: [parent_filter.filters[last_trail]]
          };
          setFilters({ ...filters })
        }
      } : null
    ]} label={<Svgicon icon="ellipsis" />} />
  </div>
}