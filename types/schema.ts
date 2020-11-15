import { SchemaUnitType, TTextColor } from ".";

// ? TD:1:H Multiple SchemaUnit interfaces for all types of schemaunit
export interface SchemaUnit {
  name: string,
  type: SchemaUnitType,
}

export interface SelectOption {
  options: {
    id: string,
    value: string,
    color: TTextColor
  }[]
}

export interface MultiSelectSchemaUnit extends SchemaUnit {
  type: "multi_select",
  options?: SelectOption
}


export interface SelectSchemaUnit extends SchemaUnit {
  type: "select",
  options?: SelectOption
}

export type TSchemaUnit = MultiSelectSchemaUnit | SelectSchemaUnit;

export interface Schema {
  [key: string]: TSchemaUnit
};

