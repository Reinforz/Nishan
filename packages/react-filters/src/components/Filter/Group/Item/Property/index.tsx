import { TViewFilters } from "@nishans/types";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../../../NotionFilter";
import { BasicSelect } from "../../../../Shared";

interface Props {
  filter: TViewFilters
}

export default function FilterGroupItemProperty({ filter }: Props) {
  const { schema, filters, setFilters } = useContext(NotionFilterContext)
  return <div className="NotionFilter-Group-Item-Property">
    <BasicSelect label="Property" value={filter.property} onChange={(e) => {
      filter.property = e.target.value as string;
      setFilters({ ...filters })
    }} items={Object.entries(schema).map(([key, value]) => ({ label: value.name, value: key }))} />
  </div>
}