import { NumberAddFunctionCreateInput, TFormulaCreateInput } from '@nishans/core';

export function counterFormula (property: string, levels: [string, string]): TFormulaCreateInput {
	return {
		function: 'if',
		result_type: 'number',
		args: [
			{
				function: 'equal',
				args: [ { property }, levels[0] ]
			},
			3,
			{
				function: 'if',
				result_type: 'number',
				args: [
					{
						function: 'equal',
						args: [ { property }, levels[1] ]
					},
					2,
					1
				]
			}
		]
	};
}

export const threePropertiesAddition = (properties: [string, string, string]): NumberAddFunctionCreateInput => {
	return {
		function: 'add',
		result_type: 'number',
		args: [
			{ property: properties[0] },
			{
				function: 'add',
				result_type: 'number',
				args: [ { property: properties[1] }, { property: properties[2] } ]
			}
		]
	};
};

export const twoPropertiesAddition = (properties: [string, string]): NumberAddFunctionCreateInput => {
	return {
		function: 'add',
		result_type: 'number',
		args: [ { property: properties[0] }, { property: properties[1] } ]
	};
};
