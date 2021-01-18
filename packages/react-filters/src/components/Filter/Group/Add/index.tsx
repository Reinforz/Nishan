import { IViewFilter } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../NotionFilter";
import { createEmptyFilter, createEmptyFilterGroup } from "../../../../utils/createFilterLiterals";
import BasicMenu from "../../../Shared/BasicMenu";

interface Props {
  filter: IViewFilter
}

export default function FilterGroupAdd({ filter }: Props) {
  const { filters, setFilters } = useContext(NotionFilterContext);
  return <div className="NotionFilter-Group-Add">
    <BasicMenu label={
      <div style={{ display: "flex" }}>
        <svg viewBox="0 0 16 16" style={{ width: "14px", height: "14px", display: "block", fill: "rgb(46, 170, 220)", flexShrink: 0, backfaceVisibility: "hidden" }}><path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path></svg>
        <span>Add a filter</span>
        <svg viewBox="0 0 30 30" style={{ width: "14px", height: "14px", display: "block", fill: "rgb(46, 170, 220)", flexShrink: 0, backfaceVisibility: "hidden" }}><polygon points="15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7 "></polygon></svg>
      </div>}
      items={[
        {
          value: "add_a_filter",
          label: "Add a filter",
          onClick() {
            filter.filters.push(createEmptyFilter());
            setFilters({ ...filters })
          }
        },
        {
          value: "add_a_filter_group",
          label: "Add a filter group",
          onClick() {
            filter.filters.push(createEmptyFilterGroup());
            setFilters({ ...filters })
          }
        }
      ]}
    />
  </div>
}