import {
  RollupViewAggregationsAggregator,
  TDateFormat,
  TFormula,
  TTextColor,
  TTimeFormat
} from '.';

export type TNumberFormat =
  | 'number'
  | 'number_with_commas'
  | 'percent'
  | 'dollar'
  | 'canadian_dollar'
  | 'euro'
  | 'pound'
  | 'yen'
  | 'ruble'
  | 'rupee'
  | 'won'
  | 'yuan'
  | 'real'
  | 'lira'
  | 'rupiah'
  | 'franc'
  | 'hong_kong_dollar'
  | 'new_zealand_dollar'
  | 'krona'
  | 'norwegian_krone'
  | 'mexican_peso'
  | 'rand'
  | 'new_taiwan_dollar'
  | 'danish_krone'
  | 'zloty'
  | 'baht'
  | 'forint'
  | 'koruna'
  | 'shekel'
  | 'chilean_peso'
  | 'philippine_peso'
  | 'dirham'
  | 'colombian_peso'
  | 'riyal'
  | 'ringgit'
  | 'leu';
export type TBasicSchemaUnitType =
  | 'text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'title'
  | 'date'
  | 'person'
  | 'file'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number';

export type TAdvancedSchemaUnitType =
  | 'formula'
  | 'relation'
  | 'rollup'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by';

export type TSchemaUnitType = TBasicSchemaUnitType | TAdvancedSchemaUnitType;

// ? TD:1:H Multiple ISchemaUnit interfaces for all types of schemaunit
export interface ISchemaUnit {
  name: string;
  type: TSchemaUnitType;
}

export interface SelectOption {
  id: string;
  value: string;
  color: Exclude<TTextColor, 'teal'> | 'green';
}

/* Basic Schema Units */

export interface TextSchemaUnit extends ISchemaUnit {
  type: 'text';
}

export interface NumberSchemaUnit extends ISchemaUnit {
  type: 'number';
  number_format?: TNumberFormat;
}

export interface SelectSchemaUnit extends ISchemaUnit {
  type: 'select';
  options: SelectOption[];
}

export interface MultiSelectSchemaUnit extends ISchemaUnit {
  type: 'multi_select';
  options: SelectOption[];
}

export interface TitleSchemaUnit extends ISchemaUnit {
  type: 'title';
}

export interface DateSchemaUnit extends ISchemaUnit {
  type: 'date';
  date_format?: TDateFormat;
  time_format?: TTimeFormat;
}

export interface PersonSchemaUnit extends ISchemaUnit {
  type: 'person';
}

export interface FileSchemaUnit extends ISchemaUnit {
  type: 'file';
}

export interface CheckboxSchemaUnit extends ISchemaUnit {
  type: 'checkbox';
}

export interface UrlSchemaUnit extends ISchemaUnit {
  type: 'url';
}

export interface EmailSchemaUnit extends ISchemaUnit {
  type: 'email';
}

export interface PhoneNumberSchemaUnit extends ISchemaUnit {
  type: 'phone_number';
}

export interface FormulaSchemaUnit extends ISchemaUnit {
  type: 'formula';
  formula: TFormula;
}

export interface RelationSchemaUnit extends ISchemaUnit {
  type: 'relation';
  collection_id: string;
  property: string;
}

export interface RollupSchemaUnit extends ISchemaUnit {
  type: 'rollup';
  collection_id?: string;
  relation_property: string;
  target_property: string;
  target_property_type: TSchemaUnitType;
  aggregation?: RollupViewAggregationsAggregator;
}

export interface CreatedTimeSchemaUnit extends ISchemaUnit {
  type: 'created_time';
}
export interface CreatedBySchemaUnit extends ISchemaUnit {
  type: 'created_by';
}
export interface LastEditedTimeSchemaUnit extends ISchemaUnit {
  type: 'last_edited_time';
}

export interface LastEditedBySchemaUnit extends ISchemaUnit {
  type: 'last_edited_by';
}

export type TBasicSchemaUnit =
  | TextSchemaUnit
  | NumberSchemaUnit
  | SelectSchemaUnit
  | MultiSelectSchemaUnit
  | TitleSchemaUnit
  | DateSchemaUnit
  | PersonSchemaUnit
  | FileSchemaUnit
  | CheckboxSchemaUnit
  | UrlSchemaUnit
  | EmailSchemaUnit
  | PhoneNumberSchemaUnit;

export type TAdvancedSchemaUnit =
  | FormulaSchemaUnit
  | RelationSchemaUnit
  | RollupSchemaUnit
  | CreatedTimeSchemaUnit
  | CreatedBySchemaUnit
  | LastEditedTimeSchemaUnit
  | LastEditedBySchemaUnit;

export type TSchemaUnit = TBasicSchemaUnit | TAdvancedSchemaUnit;

export interface Schema {
  [key: string]: TSchemaUnit;
}
