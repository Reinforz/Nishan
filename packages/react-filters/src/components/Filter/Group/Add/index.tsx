import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../NotionFilter";
import { FilterGroupProps } from "../../../../types";
import { createEmptyFilter, createEmptyFilterGroup } from "../../../../utils/createFilterLiterals";
import BasicMenu from "../../../Shared/BasicMenu";
import Svgicon from "../../../Shared/Svgicon";

export default function FilterGroupAdd({ filter, trails }: FilterGroupProps) {
  const { filters, setFilters, nestingLevel, default_group_operator } = useContext(NotionFilterContext);
  return <div className="NotionFilter-Group-Add">
    <BasicMenu label={
      <div style={{ display: "flex" }}>
        <Svgicon icon="plus" />
        <span>Add a filter</span>
        <Svgicon icon="down" />
      </div>}
      items={[
        {
          label: "Add a filter",
          icon: <Svgicon icon="plus" />,
          onClick() {
            filter.filters.push(createEmptyFilter());
            setFilters({ ...filters })
          }
        },
        nestingLevel > trails.length + 1 ? {
          label: "Add a filter group",
          icon: <Svgicon icon="stack" />,
          onClick() {
            filter.filters.push(createEmptyFilterGroup(default_group_operator));
            setFilters({ ...filters })
          },
          description: "A group to nest more filters"
        } : null
      ]}
    />
  </div>
}