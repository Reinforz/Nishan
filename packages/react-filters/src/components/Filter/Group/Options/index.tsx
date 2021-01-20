import React, { useContext } from "react";

import { NotionFilterContext } from "../../../../NotionFilter";
import { FilterGroupProps } from "../../../../types";
import BasicMenu from "../../../Shared/BasicMenu";
import Svgicon from "../../../Shared/Svgicon";

export default function FilterGroupOptions({ parent_filter, trails, filter }: FilterGroupProps) {
  const { dispatch, nestingLevel, default_group_operator } = useContext(NotionFilterContext)
  const index = trails[trails.length - 1];
  return <div className="NotionFilter-Group-Options" style={{ display: "flex", alignItems: "center" }}>
    <BasicMenu label={<Svgicon icon="ellipsis" />} items={[
      {
        label: "Remove",
        icon: <Svgicon icon="remove" />,
        onClick() {
          dispatch({ type: "REMOVE_GROUP", filter })
        }
      },
      {
        label: "Duplicate",
        icon: <Svgicon icon="duplicate" />,
        onClick() {
          parent_filter && dispatch({ type: "DUPLICATE_GROUP", filter: parent_filter, index })
        }
      },
      filter.filters.length === 1 ? {
        label: "Turn into filter",
        icon: <Svgicon icon="turn_into" />,
        onClick() {
          parent_filter && dispatch({ type: "TURN_INTO_FILTER", filter: parent_filter, index })
        }
      } : null,
      nestingLevel > trails.length + 1 ? {
        label: "Wrap in group",
        icon: <Svgicon icon="turn_into" />,
        onClick() {
          parent_filter && dispatch({ type: "WRAP_IN_GROUP", index, filter: parent_filter, operator: default_group_operator })
        },
        description: "Create a filter group around this"
      } : null
    ]} />
  </div>
}