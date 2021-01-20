import { Checkbox, TextField } from "@material-ui/core";
import { TViewFilters, SelectOption, TSchemaUnitType } from "@nishans/types";
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
  const { filter_item_label, dispatch } = useContext(NotionFilterContext);

  const target_value = (props.filter.filter as any).value,
    value = target_value.value ?? "";

  switch (props.type) {
    case "select":
    case "multi_select":
      child = props.value && <TagsAutocomplete label={""} value={value} onChange={(e, value) => {
        dispatch({ type: "CHANGE_VALUE", filter: target_value, value })
      }} options={props.value as SelectOption[]} />
      break;
    case "date":
    case "last_edited_time":
    case "created_time":
      child = props.value && <BasicSelect label={""} value={value} onChange={(e) => {
        dispatch({ type: "CHANGE_VALUE", filter: target_value, value: e.target.value })
      }} items={props.value as { value: string, label: string }[]} />
      break;
  }

  switch (props.value) {
    case "checkbox":
      child = <Checkbox
        checked={Boolean(value)}
        onChange={(e) => {
          dispatch({ type: "CHANGE_VALUE", filter: target_value, value: e.target.checked })
        }}
      />
      break;
    case "string":
      child = <TextField value={value} onChange={(e) => {
        dispatch({ type: "CHANGE_VALUE", filter: target_value, value: e.target.value })
      }} label={filter_item_label && "Value"} placeholder="Value" variant="outlined" />
      break;
    case "number":
      child = <TextField value={value} onChange={(e) => {
        dispatch({ type: "CHANGE_VALUE", filter: target_value, value: e.target.value })
      }} label={filter_item_label && "Value"} type="number" placeholder="Value" variant="outlined" />
      break;
  }

  return <div className="NotionFilter-Group-Item-Value NotionFilter-Group-Item-item">{child}</div>
}