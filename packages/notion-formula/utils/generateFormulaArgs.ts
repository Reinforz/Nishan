import { TFormulaResultType } from '@nishans/types';
import { ISchemaMap } from '../types/formula-object';
import { formulateResultTypeFromSchemaType } from './returnFormulaResultType';

export function generateFormulaArgs (value: any) {
	if (typeof value === 'boolean')
		return {
			type: 'symbol',
			name: value.toString(),
			result_type: 'checkbox'
		};
	else if (value.toString().match(/(e|pi)/))
		return {
			type: 'symbol',
			name: value,
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
}

export function generateFormulaArgFromProperty (arg: { property: string }, schema_map: ISchemaMap) {
	const schema_name = arg.property,
		result = schema_map.get(schema_name);
	if (result) {
		const { schema_id, type } = result;
		let result_type: TFormulaResultType = '' as any;
		if (result.type === 'formula') result_type = result.formula.result_type;
		else result_type = formulateResultTypeFromSchemaType(type);
		return {
			type: 'property',
			id: schema_id,
			name: result.name,
			result_type
		};
	}
}
