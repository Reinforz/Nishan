import { Checkbox, TextField } from "@material-ui/core";
import { TViewFilters, SelectOption, TSchemaUnitType, CheckboxViewFilters } from "@nishans/types";
import React, { useContext } from "react";

import { NotionFilterContext } from "../../../../../NotionFilter";
import { TFilterItemValue } from "../../../../../types";
import { BasicSelect } from "../../../../Shared";
import TagsAutocomplete from "../../../../Shared/TagsAutocomplete";

interface Props {
  value: TFilterItemValue,
  type: TSchemaUnitType,
  filter: TViewFilters
}

export default function FilterGroupItemValue(props: Props) {
  let child: any = null;
  const { filter_item_label, filters, setFilters } = useContext(NotionFilterContext);

  const value = (props.filter.filter as any).value.value ?? "";

  switch (props.type) {
    case "select":
    case "multi_select":
      child = props.value && <TagsAutocomplete label={""} value={value} onChange={(e, value) => {
        (props.filter.filter as any).value.value = value;
        setFilters({ ...filters })
      }} options={props.value as SelectOption[]} />
      break;
    case "date":
    case "last_edited_time":
    case "created_time":
      child = props.value && <BasicSelect label={""} value={value} onChange={(e) => {
        (props.filter.filter as any).value.value = e.target.value;
        setFilters({ ...filters })
      }} items={props.value as { value: string, label: string }[]} />
      break;
  }

  switch (props.value) {
    case "checkbox":
      child = <Checkbox
        checked={Boolean(value)}
        onChange={(e) => {
          ((props.filter as CheckboxViewFilters).filter as any).value.value = e.target.checked;
          setFilters({ ...filters });
        }}
      />
      break;
    case "string":
      child = <TextField value={value} onChange={(e) => {
        (props.filter.filter as any).value.value = e.target.value;
        setFilters({ ...filters })
      }} label={filter_item_label && "Value"} placeholder="Value" variant="outlined" />
      break;
    case "number":
      child = <TextField value={value} onChange={(e) => {
        (props.filter.filter as any).value.value = e.target.value;
        setFilters({ ...filters })
      }} label={filter_item_label && "Value"} type="number" placeholder="Value" variant="outlined" />
      break;
  }

  return <div className="NotionFilter-Group-Item-Value NotionFilter-Group-Item-item">{child}</div>
}