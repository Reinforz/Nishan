import {
	CheckboxSchemaUnit,
	DateSchemaUnit,
	FileSchemaUnit,
	NumberSchemaUnit,
	TextSchemaUnit,
	TitleSchemaUnit,
	TSchemaUnit,
	TSchemaUnitType
} from '@nishans/types';

const sug = (type: TSchemaUnitType) =>
	({
		type,
		name: type.charAt(0).toUpperCase() + type.substr(1)
	} as TSchemaUnit);

/**
 * Title schema unit
 */
export const tsu = sug('title') as TitleSchemaUnit;
export const nsu = sug('number') as NumberSchemaUnit;
export const txsu = sug('text') as TextSchemaUnit;
export const fsu = sug('file') as FileSchemaUnit;
export const dsu = sug('date') as DateSchemaUnit;
export const csu = sug('checkbox') as CheckboxSchemaUnit;
