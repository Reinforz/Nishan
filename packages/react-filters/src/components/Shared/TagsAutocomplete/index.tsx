import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { UseAutocompleteProps } from '@material-ui/lab';
import { SelectOption } from '@nishans/types';

interface Props {
  options: SelectOption[]
  value: any
  label?: string,
  onChange: UseAutocompleteProps<SelectOption, false, false, false>["onChange"],
}

export function TagsAutocomplete(props: Props) {
  return (
    <Autocomplete
      disableClearable={true}
      className="BasicAutocomplete"
      options={props.options}
      renderOption={({ value }) => (
        <span className="BasicAutocomplete-options-label">{value}</span>
      )}
      getOptionLabel={({ value }) => value}
      style={{ width: 300 }}
      getOptionSelected={(option) => option.value === props.value.value}
      onChange={props.onChange}
      value={props.value}
      renderInput={(params) =>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          {props.value.icon}
          <TextField {...params} label={props.label} />
        </div>
      }
    />
  );
}