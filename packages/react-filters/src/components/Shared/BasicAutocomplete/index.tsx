import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { UseAutocompleteProps } from '@material-ui/lab';

interface PropsOptions {
  label: string,
  value: string,
}

interface Props {
  options: PropsOptions[]
  value: any
  label: string,
  onChange: UseAutocompleteProps<PropsOptions, false, false, false>["onChange"],
}

export function BasicAutocomplete(props: Props) {
  return (
    <Autocomplete
      id="combo-box-demo"
      options={props.options}
      getOptionLabel={(option) => option.label}
      style={{ width: 300 }}
      onChange={props.onChange}
      value={props.value}
      renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
    />
  );
}