import { generateFormulaASTFromArray } from './array';
import { generateFormulaASTFromObject } from './object';
import { generateFormulaASTFromString } from './string';

export const GenerateAST = {
	string: generateFormulaASTFromString,
	object: generateFormulaASTFromObject,
	array: generateFormulaASTFromArray
};
