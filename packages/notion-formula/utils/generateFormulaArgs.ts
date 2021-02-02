import { TConstantFormula, TFormulaResultType, TPropertyFormula, TSymbolFormula } from '@nishans/types';
import { ISchemaMap } from '../types/formula-object';
import { formulateResultTypeFromSchemaType } from './formulateResultTypeFromSchemaType';

/**
 * Generate function formula arg based on certain criterias 
 * @param value The value to check
 * @returns The appropriate function formula argument chunk
 */
export function generateFormulaArgsFromLiterals (value: number | string | boolean): TSymbolFormula | TConstantFormula {
	// boolean can only be checkbox symbol
	if (typeof value === 'boolean')
		return {
			type: 'symbol',
			name: value.toString() as any,
			result_type: 'checkbox'
		};
	else if (value.toString().match(/^(e|pi)$/))
		// e or pi can only be number symbol
		return {
			type: 'symbol',
			name: value as any,
			result_type: 'number'
		};
	else if (typeof value === 'number')
		// numbers can only be number constant
		return {
			type: 'constant',
			value: value.toString(),
			value_type: 'number',
			result_type: 'number'
		};
	else if (typeof value === 'string')
		// string can only be text constant
		return {
			type: 'constant',
			value: value.toString(),
			value_type: 'string',
			result_type: 'text'
		};
	else
		// otherwise all other values are malformed
		throw new Error(`${value} is a malformed value`);
}

/**
 * Generate function formula argument using information from the passed schema_map
 * @param arg A object with the key property and value matching the name of the property referencing
 * @param schema_map The schema map used to deduce information for the function formula argument chunk
 * @returns The appropriate property based function formula argument chunk
 */
export function generateFormulaArgFromProperty (arg: { property: string }, schema_map: ISchemaMap): TPropertyFormula {
	// get the schema_info from the schema_map passed using the arg.property
	const schema_name = arg.property,
		schema_info = schema_map.get(schema_name);

	// only if schema_info exists proceed further
	if (schema_info) {
		const { name, schema_id, type } = schema_info;
		// calculate the result_type
		// if the schema unit is a formula, set the result_type as the result_type of the formula
		// else if the schema unit is a rollup pass the specific property target_property_type, else just pass the type of the schema_unit
		// and based on whats passed calculate the result_type since all schema_unit finally coerces into the supported result_type
		const result_type: TFormulaResultType =
			schema_info.type === 'formula'
				? schema_info.formula.result_type
				: formulateResultTypeFromSchemaType(schema_info.type === 'rollup' ? schema_info.target_property_type : type);
		return {
			type: 'property',
			id: schema_id,
			name,
			result_type
		};
	} else throw new Error(`Property ${schema_name} does not exist on the given schema_map`);
}
