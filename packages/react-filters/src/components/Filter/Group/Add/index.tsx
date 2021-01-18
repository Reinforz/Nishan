import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../NotionFilter";
import { createEmptyFilter, createEmptyFilterGroup } from "../../../../utils/createFilterLiterals";
import BasicMenu from "../../../Shared/BasicMenu";
import Svgicon from "../../../Shared/Svgicon";

interface Props {
  filter: IViewFilter
}

export default function FilterGroupAdd({ filter }: Props) {
  const { filters, setFilters } = useContext(NotionFilterContext);
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
        {
          label: "Add a filter group",
          icon: <Svgicon icon="stack" />,
          onClick() {
            filter.filters.push(createEmptyFilterGroup());
            setFilters({ ...filters })
          }
        }
      ]}
    />
  </div>
}