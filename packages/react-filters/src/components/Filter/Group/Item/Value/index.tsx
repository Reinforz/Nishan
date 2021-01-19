import { Checkbox, TextField } from "@material-ui/core";
import { SelectOption, TSchemaUnitType } from "@nishans/types";
import React, { useContext } from "react";

import { NotionFilterContext } from "../../../../../NotionFilter";
import { TFilterItemValue } from "../../../../../types";
import TagsAutocomplete from "../../../../Shared/TagsAutocomplete";

interface Props {
  value: TFilterItemValue,
  type: TSchemaUnitType
}

export default function FilterGroupItemValue(props: Props) {
  let child: any = null;
  const { filter_item_label } = useContext(NotionFilterContext);

  switch (props.type) {
    case "select":
    case "multi_select":
      child = props.value && <TagsAutocomplete label={""} value={""} onChange={() => { }} options={props.value as SelectOption[]} />
  }

  switch (props.value) {
    case "checkbox":
      child = <Checkbox
        checked={false}
        onChange={() => { }}
      />
      break;
    case "string":
      child = <TextField label={filter_item_label && "Value"} placeholder="Value" variant="outlined" />
      break;
    case "number":
      child = <TextField label={filter_item_label && "Value"} type="number" placeholder="Value" variant="outlined" />
      break;
  }

  return <div className="NotionFilter-Group-Item-Value NotionFilter-Group-Item-item">{child}</div>
}