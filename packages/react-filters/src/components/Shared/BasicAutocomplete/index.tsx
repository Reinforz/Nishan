import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { UseAutocompleteProps } from '@material-ui/lab';

interface Option {
  label: string,
  value: string,
  icon?: JSX.Element
}

interface Props {
  options: Option[]
  value: any
  label?: string,
  onChange: UseAutocompleteProps<Option, false, false, false>["onChange"],
}

export function BasicAutocomplete(props: Props) {
  return (
    <Autocomplete
      disableClearable={true}
      className="BasicAutocomplete"
      options={props.options}
      renderOption={({ icon, label }) => (
        <React.Fragment>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            {icon && <span className="BasicAutocomplete-options-icon">{icon}</span>} <span className="BasicAutocomplete-options-label">{label}</span>
          </div>
        </React.Fragment>
      )}
      getOptionLabel={({ label }) => label}
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