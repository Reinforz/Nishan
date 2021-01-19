import { FormControl, InputLabel, Select, MenuItem, SelectProps, createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { useContext } from "react";
import { NotionFilterContext } from "../../../NotionFilter";

interface Props {
  label: string,
  value: any
  onChange: SelectProps["onChange"],
  items: {
    label: string,
    value: any,
    icon?: JSX.Element
  }[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

export function BasicSelect(props: Props) {
  const classes = useStyles();
  const { filter_item_label } = useContext(NotionFilterContext)

  return <FormControl className={classes.formControl}>
    {filter_item_label && <InputLabel>{props.label}</InputLabel>}
    <Select
      value={props.value}
      onChange={props.onChange}
    >
      {props.items.map(({ value, label, icon = null }) => <MenuItem key={value} value={value}>{icon} {label}</MenuItem>)}
    </Select>
  </FormControl>
}