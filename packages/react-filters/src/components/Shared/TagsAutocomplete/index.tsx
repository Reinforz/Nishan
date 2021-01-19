import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { UseAutocompleteProps } from '@material-ui/lab';
import { SelectOption } from '@nishans/types';

const ColorMapper: Record<string, string> = {
  red: "#ff7369",
  orange: "#ffa344",
  yellow: "#ffdc49",
  green: "#4dab9a",
  blue: "#529cca",
  violet: "#9a6dd7",
  pink: "#e255a1",
  brown: "#937264",
  gray: "#979a9b",
  default: "#505558",
}

interface Props {
  options: SelectOption[]
  value: any
  label?: string,
  onChange: UseAutocompleteProps<SelectOption, false, false, false>["onChange"],
}

export default function TagsAutocomplete(props: Props) {
  return (
    <Autocomplete
      disableClearable={true}
      className="TagsAutocomplete"
      options={props.options}
      renderOption={({ value, color }) => (
        <span className="TagsAutocomplete-option" style={{ backgroundColor: ColorMapper[color] }}>{value}</span>
      )}
      getOptionLabel={({ value }) => value ?? ""}
      style={{ width: 150 }}
      getOptionSelected={(option) => option.value === props.value.value}
      onChange={props.onChange}
      value={props.value}
      renderInput={(params) =>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <TextField {...params} label={props.label} />
        </div>
      }
    />
  );
}