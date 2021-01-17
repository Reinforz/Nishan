import { FormControl, InputLabel, Select, MenuItem, SelectProps } from "@material-ui/core";
import React from "react";

interface Props {
  label: string,
  value: string
  onChange: SelectProps["onChange"],
  items: {
    label: string,
    value: any
  }[]
}

export function BasicSelect(props: Props) {
  <FormControl>
    <InputLabel>{props.label}</InputLabel>
    <Select
      value={props.value}
      onChange={props.onChange}
    >
      {props.items.map(({ value, label }) => <MenuItem value={value}>{label}</MenuItem>)}
    </Select>
  </FormControl>
}