import { TTextColor } from ".";

export type TBasicSchemaUnitType = 'text' | 'number' | 'select' | 'multi_select' | 'title' | 'date' | 'person' | 'file' | 'checkbox' | 'url' | 'email' | 'phone_number';
export type TAdvancedSchemaUnitType = 'formula' | 'relation' | 'rollup' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by';
export type TSchemaUnitType = TBasicSchemaUnitType | TAdvancedSchemaUnitType;

// ? TD:1:H Multiple SchemaUnit interfaces for all types of schemaunit
export interface SchemaUnit {
  name: string,
  type: TSchemaUnitType,
}

export interface SelectOption {
  options: {
    id: string,
    value: string,
    color: TTextColor
  }[]
}

/* Basic Schema Units */

export interface TextSchemaUnit extends SchemaUnit {
  type: "text",
}

export interface NumberSchemaUnit extends SchemaUnit {
  type: "number"
}

export interface SelectSchemaUnit extends SchemaUnit {
  type: "select",
  options: SelectOption
}

export interface MultiSelectSchemaUnit extends SchemaUnit {
  type: "multi_select",
  options: SelectOption
}

export interface TitleSchemaUnit extends SchemaUnit {
  type: "title"
}

export interface DateSchemaUnit extends SchemaUnit {
  type: "date"
}

export interface PersonSchemaUnit extends SchemaUnit {
  type: "person"
}

export interface FileSchemaUnit extends SchemaUnit {
  type: "file"
}

export interface CheckboxSchemaUnit extends SchemaUnit {
  type: "checkbox"
}

export interface UrlSchemaUnit extends SchemaUnit {
  type: "url"
}

export interface EmailSchemaUnit extends SchemaUnit {
  type: "email"
}

export interface PhoneNumberSchemaUnit extends SchemaUnit {
  type: "phone_number"
}

export interface FormulaSchemaUnit extends SchemaUnit {
  type: "formula"
}
export interface RelationSchemaUnit extends SchemaUnit {
  type: "relation"
}
export interface RollupSchemaUnit extends SchemaUnit {
  type: "rollup"
}
export interface CreatedTimeSchemaUnit extends SchemaUnit {
  type: "created_time"
}
export interface CreatedBySchemaUnit extends SchemaUnit {
  type: "created_by"
}
export interface LastEditedTimeSchemaUnit extends SchemaUnit {
  type: "last_edited_time"
}

export interface LastEditedBySchemaUnit extends SchemaUnit {
  type: "last_edited_by"
}

export type TBasicSchemaUnit = TextSchemaUnit | NumberSchemaUnit | SelectSchemaUnit | MultiSelectSchemaUnit | TitleSchemaUnit | DateSchemaUnit | PersonSchemaUnit | FileSchemaUnit | CheckboxSchemaUnit | UrlSchemaUnit | EmailSchemaUnit | PhoneNumberSchemaUnit;

export type TAdvancedSchemaUnit = FormulaSchemaUnit | RelationSchemaUnit | RollupSchemaUnit | CreatedTimeSchemaUnit | CreatedBySchemaUnit | LastEditedTimeSchemaUnit | LastEditedBySchemaUnit;

export type TSchemaUnit = TBasicSchemaUnit | TAdvancedSchemaUnit;

export interface Schema {
  [key: string]: TSchemaUnit
};

