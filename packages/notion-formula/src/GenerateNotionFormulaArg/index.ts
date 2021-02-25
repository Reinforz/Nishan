import { generateNotionFormulaArgFromLiteral } from './literal';
import { generateNotionFormulaArgFromProperty } from './property';

export const GenerateNotionFormulaArg = {
	literal: generateNotionFormulaArgFromLiteral,
	property: generateNotionFormulaArgFromProperty
};
