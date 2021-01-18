import { FormControl, InputLabel, Select, MenuItem, SelectProps, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";

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
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

export function BasicSelect(props: Props) {
  const classes = useStyles();
  return <FormControl className={classes.formControl}>
    <InputLabel>{props.label}</InputLabel>
    <Select
      value={props.value}
      onChange={props.onChange}
    >
      {props.items.map(({ value, label, icon = null }) => <MenuItem key={value} value={value}>{icon} {label}</MenuItem>)}
    </Select>
  </FormControl>
}