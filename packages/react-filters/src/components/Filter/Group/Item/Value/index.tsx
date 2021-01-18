import { Checkbox, TextField } from "@material-ui/core";
import React from "react";
import { TFilterItemValue } from "../../../../../types";

interface Props {
  value: TFilterItemValue
}

export default function FilterGroupItemValue(props: Props) {
  let child: any = null;
  switch (props.value) {
    case "checkbox":
      return <Checkbox
        checked={false}
        onChange={() => { }}
      />
    case "string":
      return <TextField label="Value" />
  }

  return <div className="NotionFilter-Group-Item-Value">{child}</div>
}