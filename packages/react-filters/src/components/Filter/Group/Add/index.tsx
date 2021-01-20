import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../NotionFilter";
import { FilterGroupProps } from "../../../../types";
import BasicMenu from "../../../Shared/BasicMenu";
import Svgicon from "../../../Shared/Svgicon";

export default function FilterGroupAdd({ filter, trails }: FilterGroupProps) {
  const { dispatch, nestingLevel } = useContext(NotionFilterContext);
  return <div className="NotionFilter-Group-Add" style={{ left: 100 * (trails.length) }}>
    {filter.filters.length === 0 && <div>No Filters Added</div>}
    <BasicMenu label={
      <div style={{ display: "flex" }}>
        <Svgicon icon="plus" className="NotionFilter-Group-Add-Icon" />
        <span>Add a filter</span>
        <Svgicon icon="down" className="NotionFilter-Group-Add-Icon" />
      </div>}
      items={[
        {
          label: "Add a filter",
          icon: <Svgicon icon="plus" />,
          onClick() {
            dispatch({ type: "ADD_FILTER", filter })
          }
        },
        nestingLevel > trails.length + 1 ? {
          label: "Add a filter group",
          icon: <Svgicon icon="stack" />,
          onClick() {
            dispatch({ type: "ADD_FILTER_GROUP", filter })
          },
          description: "A group to nest more filters"
        } : null
      ]}
    />
  </div>
}