export function formulaUtil (property: string, levels: [string, string]): TFormulaCreateInput {
	return [
		'if',
		[ [ 'equal', [ { property }, levels[0] ] ], 3, [ 'if', [ [ 'equal', [ { property }, levels[1] ] ], 2, 1 ] ] ]
	];
}
