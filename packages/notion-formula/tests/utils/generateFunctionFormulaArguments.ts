import {
	TConstantFormula,
	TFormulaResultType,
	TFormulaType,
	TFunctionFormula,
	TPropertyFormula,
	TSymbolFormula
} from '@nishans/types';
import { TFormulaArrayCreateInput, TFormulaCreateInput } from '../../src';
import {
	generateCheckboxFunction,
	generateCheckboxProperty,
	generateCheckboxSymbol,
	generateDateFunction,
	generateDateProperty,
	generateNumberConstant,
	generateNumberFunction,
	generateNumberProperty,
	generateNumberSymbol,
	generateTextConstant,
	generateTextFunction,
	generateTextProperty
} from './generateFormulaParts';

interface IArguments {
	ast: IArgument['ast'][];
	object: IArgument['object'][];
	array: IArgument['array'][];
	message: string;
}

interface IArgument {
	ast: TPropertyFormula | TSymbolFormula | TConstantFormula | TFunctionFormula;
	object: { property: string } | boolean | 'e' | 'pi' | number | string | TFormulaCreateInput;
	array: { property: string } | boolean | 'e' | 'pi' | number | string | TFormulaArrayCreateInput;
}

const rt_arg_variant_mapper: Record<TFormulaResultType, TFormulaType[]> = {
	number: [ 'property', 'symbol', 'constant', 'function' ],
	text: [ 'property', 'constant', 'function' ],
	checkbox: [ 'property', 'symbol', 'function' ],
	date: [ 'property', 'function' ]
};

function generateCombos (rts: TFormulaResultType[]) {
	function generateCombos (lhs: string[], rhs: string[]) {
		const res: string[] = [];
		lhs.forEach((lhs) => {
			rhs.forEach((rhs) => res.push(`${lhs} x ${rhs}`));
		});
		return res;
	}

	let final_combos: string[] = [];
	rts.forEach((rt, index) => {
		const source: string[] = [];
		const supported_rt_variants = rt_arg_variant_mapper[rt];
		supported_rt_variants.forEach((supported_rt_variant) => source.push(`${rt}.${supported_rt_variant}`));
		if (index !== 0) final_combos = generateCombos(final_combos, source);
		else final_combos = source;
	});
	return final_combos;
}

export function generateFunctionFormulaArguments (arg_return_types: TFormulaResultType[]): IArguments[] {
	return generateArgumentsFromCombos(generateCombos(arg_return_types));
}

function generateArgumentsFromCombos (combos: string[]) {
	const results: IArguments[] = [];

	combos.forEach((combo) => {
		const chunks = combo.split(' x '),
			result: IArguments = {
				message: combo,
				ast: [],
				array: [],
				object: []
			};
		chunks.forEach((chunk) => {
			const argument = generateArgumentsFromResultTypesAndVariants(chunk);
			result.ast.push(argument.ast);
			result.array.push(argument.array);
			result.object.push(argument.object);
		});
		results.push(result);
	});
	return results;
}

function generateArgumentsFromResultTypesAndVariants (chunk: string) {
	const res: IArgument = {} as any;
	switch (chunk) {
		case 'number.property':
			res.ast = generateNumberProperty('number');
			res.array = { property: 'number' };
			res.object = { property: 'number' };
			break;
		case 'number.symbol':
			res.ast = generateNumberSymbol('e');
			res.array = 'e';
			res.object = 'e';
			break;
		case 'number.constant':
			res.ast = generateNumberConstant(1);
			res.array = 1;
			res.object = 1;
			break;
		case 'number.function':
			res.ast = generateNumberFunction('abs', [ generateNumberConstant(1) ]);
			res.array = [ 'abs', [ 1 ] ];
			res.object = {
				function: 'abs',
				args: [ 1 ]
			};
			break;
		case 'text.property':
			res.ast = generateTextProperty('text');
			res.array = { property: 'text' };
			res.object = { property: 'text' };
			break;
		case 'text.constant':
			res.ast = generateTextConstant('text');
			res.array = 'text';
			res.object = 'text';
			break;
		case 'text.function':
			res.ast = generateTextFunction('format', [ generateTextConstant('0') ]);
			res.array = [ 'format', [ '0' ] ];
			res.object = { function: 'format', args: [ '0' ] };
			break;
		case 'checkbox.property':
			res.ast = generateCheckboxProperty('checkbox');
			res.array = { property: 'checkbox' };
			res.object = { property: 'checkbox' };
			break;
		case 'checkbox.symbol':
			res.ast = generateCheckboxSymbol(true);
			res.array = true;
			res.object = true;
			break;
		case 'checkbox.function':
			res.ast = generateCheckboxFunction('equal', [ generateTextConstant('0'), generateTextConstant('1') ]);
			res.array = [ 'equal', [ '0', '1' ] ];
			res.object = { function: 'equal', args: [ '0', '1' ] };
			break;
		case 'date.property':
			res.ast = generateDateProperty('date');
			res.array = { property: 'date' };
			res.object = { property: 'date' };
			break;
		case 'date.function':
			res.ast = generateDateFunction('end', [ generateDateFunction('now') ]);
			res.array = [ 'end', [ [ 'now' ] ] ];
			res.object = { function: 'end', args: [ { function: 'now' } ] };
			break;
	}
	return res;
}
