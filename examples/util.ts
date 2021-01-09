import { TFormulaCreateInput } from '@nishans/core';

export function formulaUtil (property: string, levels: [string, string]): TFormulaCreateInput {
	return {
		function: 'if',
		args: [
			{
				function: 'equal',
				args: [ { property }, levels[0] ]
			},
			3,
			{
				function: 'if',
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
