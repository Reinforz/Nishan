import { TViewFilters } from "@nishans/types";
import React, { useContext } from "react";

import { NotionFilterContext } from "../../../../../NotionFilter";
import { orderSchema } from "../../../../../utils/orderSchema";
import { BasicSelect } from "../../../../Shared";

interface Props {
  filter: TViewFilters
}

export default function FilterGroupItemProperty({ filter }: Props) {
  const { schema, filters, setFilters } = useContext(NotionFilterContext)
  const ordered_schema = orderSchema(schema);
  return <div className="NotionFilter-Group-Item-Property">
    <BasicSelect label="Property" value={filter.property} onChange={(e) => {
      filter.property = e.target.value as string;
      setFilters({ ...filters })
    }} items={ordered_schema.map(({ name, schema_id }) => ({ label: name, value: schema_id }))} />
  </div>
}