import { NotionErrors } from '@nishans/errors';
import { TFormulaResultType, TPropertyFormula } from '@nishans/types';
import { ISchemaMap } from '../';
import { getResultTypeFromSchemaType } from '../GenerateAST/utils';

/**
 * Generate function formula argument using information from the passed schema_map
 * @param arg A object with the key property and value matching the name of the property referencing
 * @param schema_map The schema map used to deduce information for the function formula argument chunk
 * @returns The appropriate property based function formula argument chunk
 */
export function generateNotionFormulaArgFromProperty (
	arg: { property: string },
	schema_map: ISchemaMap
): TPropertyFormula {
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
				: getResultTypeFromSchemaType(schema_info.type === 'rollup' ? schema_info.target_property_type : type);
		return {
			type: 'property',
			id: schema_id,
			name,
			result_type
		};
	} else throw new NotionErrors.unknown_property_reference(schema_name, [ 'property' ]);
}
