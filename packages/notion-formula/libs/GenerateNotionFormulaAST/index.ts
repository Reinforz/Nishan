import { generateFormulaASTFromArray } from './array';
import { generateFormulaASTFromObject } from './object';
import { generateFormulaASTFromString } from './string';

export const GenerateNotionFormulaAST = {
	string: generateFormulaASTFromString,
	object: generateFormulaASTFromObject,
	array: generateFormulaASTFromArray
};
