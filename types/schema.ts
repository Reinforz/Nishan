import { TTextColor } from ".";

export type TBasicSchemaUnitType = 'text' | 'number' | 'select' | 'multi_select' | 'title' | 'date' | 'person' | 'file' | 'checkbox' | 'url' | 'email' | 'phone_number';
export type TAdvancedSchemaUnitType = 'formula' | 'relation' | 'rollup' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by';
export type TSchemaUnitType = TBasicSchemaUnitType | TAdvancedSchemaUnitType;

// ? TD:1:H Multiple ISchemaUnit interfaces for all types of schemaunit
export interface ISchemaUnit {
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

export interface TextSchemaUnit extends ISchemaUnit {
  type: "text",
}

export interface NumberSchemaUnit extends ISchemaUnit {
  type: "number"
}

export interface SelectSchemaUnit extends ISchemaUnit {
  type: "select",
  options: SelectOption
}

export interface MultiSelectSchemaUnit extends ISchemaUnit {
  type: "multi_select",
  options: SelectOption
}

export interface TitleSchemaUnit extends ISchemaUnit {
  type: "title"
}

export interface DateSchemaUnit extends ISchemaUnit {
  type: "date"
}

export interface PersonSchemaUnit extends ISchemaUnit {
  type: "person"
}

export interface FileSchemaUnit extends ISchemaUnit {
  type: "file"
}

export interface CheckboxSchemaUnit extends ISchemaUnit {
  type: "checkbox"
}

export interface UrlSchemaUnit extends ISchemaUnit {
  type: "url"
}

export interface EmailSchemaUnit extends ISchemaUnit {
  type: "email"
}

export interface PhoneNumberSchemaUnit extends ISchemaUnit {
  type: "phone_number"
}

export interface FormulaSchemaUnit extends ISchemaUnit {
  type: "formula"
}
export interface RelationSchemaUnit extends ISchemaUnit {
  type: "relation",
  collection_id: string,
  property: string,
}

export interface RollupSchemaUnit extends ISchemaUnit {
  type: "rollup",
  collection_id: string,
  property: string,
  relation_property: string,
  target_property: string,
  target_property_type: TSchemaUnitType,
}

export interface CreatedTimeSchemaUnit extends ISchemaUnit {
  type: "created_time"
}
export interface CreatedBySchemaUnit extends ISchemaUnit {
  type: "created_by"
}
export interface LastEditedTimeSchemaUnit extends ISchemaUnit {
  type: "last_edited_time"
}

export interface LastEditedBySchemaUnit extends ISchemaUnit {
  type: "last_edited_by"
}

export type TBasicSchemaUnit = TextSchemaUnit | NumberSchemaUnit | SelectSchemaUnit | MultiSelectSchemaUnit | TitleSchemaUnit | DateSchemaUnit | PersonSchemaUnit | FileSchemaUnit | CheckboxSchemaUnit | UrlSchemaUnit | EmailSchemaUnit | PhoneNumberSchemaUnit;

export type TAdvancedSchemaUnit = FormulaSchemaUnit | RelationSchemaUnit | RollupSchemaUnit | CreatedTimeSchemaUnit | CreatedBySchemaUnit | LastEditedTimeSchemaUnit | LastEditedBySchemaUnit;

export type TSchemaUnit = TBasicSchemaUnit | TAdvancedSchemaUnit;

export interface Schema {
  [key: string]: TSchemaUnit
};

