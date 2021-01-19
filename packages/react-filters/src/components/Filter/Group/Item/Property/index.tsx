import { TSchemaUnitType, TViewFilters } from "@nishans/types";
import React, { useContext } from "react";

import { NotionFilterContext } from "../../../../../NotionFilter";
import { orderSchema } from "../../../../../utils/orderSchema";
import { BasicAutocomplete } from "../../../../Shared/BasicAutocomplete";
import Svgicon from "../../../../Shared/Svgicon";

function getSvgFile(type: TSchemaUnitType): JSX.Element {
  switch (type) {
    case "created_time":
    case "last_edited_time":
      return <Svgicon icon="time" />
    case "select":
      return <Svgicon icon="select" />
    case "rollup":
      return <Svgicon icon="magnifying_glass" />
    case "phone_number":
      return <Svgicon icon="phone" />
    case "person":
      return <Svgicon icon="persons" />
    case "number":
      return <Svgicon icon="number" />
    case "multi_select":
      return <Svgicon icon="multi_select" />
    case "formula":
      return <Svgicon icon="integration" />
    case "file":
      return <Svgicon icon="clip" />
    case "email":
      return <Svgicon icon="at_rate" />
    case "date":
      return <Svgicon icon="calendar" />
    case "checkbox":
      return <Svgicon icon="checkbox" />
    case "title":
      return <Svgicon icon="Aa" />
    case "url":
      return <Svgicon icon="chain" />
    case "text":
      return <Svgicon icon="text" />
    case "created_by":
    case "last_edited_by":
      return <Svgicon icon="person" />
    default:
      return <span></span>;
  }
}

interface Props {
  filter: TViewFilters
}

export default function FilterGroupItemProperty({ filter }: Props) {
  const { schema, filters, setFilters } = useContext(NotionFilterContext)
  const ordered_schema = orderSchema(schema),
    ordered_schema_options = ordered_schema.map(({ name, schema_id, type }) => ({ icon: getSvgFile(type), label: name, value: schema_id }));
  return <div className="NotionFilter-Group-Item-Property NotionFilter-Group-Item-item">
    <BasicAutocomplete value={{ icon: getSvgFile(schema[filter.property].type), label: schema[filter.property].name, value: filter.property }} onChange={(e, value) => {
      filter.property = value?.value as string;
      setFilters({ ...filters })
    }} options={ordered_schema_options} />
  </div>
}