import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";

import { NotionFilterContext } from "../../../../NotionFilter";
import BasicMenu from "../../../Shared/BasicMenu";
import Svgicon from "../../../Shared/Svgicon";

interface Props {
  filter: IViewFilter,
}


export default function FilterGroupOptions({ filter }: Props) {
  const { filters, setFilters } = useContext(NotionFilterContext)

  return <div className="NotionFilter-Group-Options" style={{ display: "flex", alignItems: "center" }}>
    <BasicMenu label={<Svgicon icon="ellipsis" />} items={[
      {
        label: "Remove",
        icon: <Svgicon icon="remove" />,
        onClick() {
          filter.filters = []
          setFilters({ ...filters })
        }
      },
      {
        label: "Duplicate",
        icon: <Svgicon icon="duplicate" />,
        onClick() {
          filter.filters.push(JSON.parse(JSON.stringify(filter.filters[filter.filters.length - 1])));
          setFilters({ ...filters })
        }
      },
      filter.filters.length === 1 ? {
        label: "Turn into filter",
        icon: <Svgicon icon="turn_into" />,
        onClick() {

        }
      } : null,
      {
        label: "Wrap in group",
        icon: <Svgicon icon="turn_into" />,
        onClick() {

        }
      }
    ]} />
  </div>
}