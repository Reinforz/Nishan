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
  const index = trails[trails.length - 1];
  const { dispatch, nestingLevel, default_group_operator } = useContext(NotionFilterContext)

  return <div className="NotionFilter-Group-Item-Options NotionFilter-Group-Item-item">
    <BasicMenu items={[
      {
        label: "Remove",
        icon: <Svgicon icon="remove" />,
        onClick() {
          dispatch({ type: "REMOVE_FILTER", filter: parent_filter, index })
        }
      },
      {
        label: "Duplicate",
        icon: <Svgicon icon="duplicate" />,
        onClick() {
          dispatch({ type: "DUPLICATE_FILTER", filter: parent_filter, index })
        }
      },
      nestingLevel > trails.length ? {
        label: "Turn into group",
        icon: <Svgicon icon="turn_into" />,
        onClick() {
          dispatch({ type: "TURN_INTO_GROUP", filter: parent_filter, index, operator: default_group_operator })
        }
      } : null
    ]} label={<Svgicon icon="ellipsis" />} />
  </div>
}