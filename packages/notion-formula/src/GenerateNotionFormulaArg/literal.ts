import { TConstantFormula, TSymbolFormula } from '@nishans/types';

/**
 * Generate function formula arg based on certain criteria
 * @param value The value to check
 * @returns The appropriate function formula argument chunk
 */
export function generateNotionFormulaArgFromLiteral (
	value: number | string | boolean
): TSymbolFormula | TConstantFormula {
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
