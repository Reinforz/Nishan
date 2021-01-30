import { TConstantFormula, TFormulaResultType, TPropertyFormula, TSymbolFormula } from '@nishans/types';
import { ISchemaMap } from '../types/formula-object';
import { formulateResultTypeFromSchemaType } from './returnFormulaResultType';

/**
 * Generate function formula arg based on certain criterias 
 * @param value The value to check
 * @returns The appropriate function formula argument chunk
 */
export function generateFormulaArgsFromLiterals (value: number | string | boolean): TSymbolFormula | TConstantFormula {
	if (typeof value === 'boolean')
		return {
			type: 'symbol',
			name: value.toString() as any,
			result_type: 'checkbox'
		};
	else if (value.toString().match(/^(e|pi)$/))
		return {
			type: 'symbol',
			name: value as any,
			result_type: 'number'
		};
	else if (typeof value === 'number')
		return {
			type: 'constant',
			value: value.toString(),
			value_type: 'number',
			result_type: 'number'
		};
	else if (typeof value === 'string')
		return {
			type: 'constant',
			value: value.toString(),
			value_type: 'string',
			result_type: 'text'
		};
	else throw new Error(`${value} is a malformed value`);
}

/**
 * Generate function formula argument using information from the passed schema_map
 * @param arg A object with the key property and value matching the name of the property referencing
 * @param schema_map The schema map used to deduce information for the function formula argument chunk
 * @returns The appropriate property based function formula argument chunk
 */
export function generateFormulaArgFromProperty (arg: { property: string }, schema_map: ISchemaMap): TPropertyFormula {
	const schema_name = arg.property,
		result = schema_map.get(schema_name);
	if (result) {
		const { schema_id, type } = result;
		let result_type: TFormulaResultType = '' as any;
		if (result.type === 'formula') result_type = result.formula.result_type;
		else result_type = formulateResultTypeFromSchemaType(result.type === 'rollup' ? result.target_property_type : type);
		return {
			type: 'property',
			id: schema_id,
			name: result.name,
			result_type
		};
	} else throw new Error(`Property ${schema_name} does not exist on the given schema_map`);
}
