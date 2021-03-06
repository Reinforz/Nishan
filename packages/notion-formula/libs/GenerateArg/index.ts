import { generateNotionFormulaArgFromLiteral } from './literal';
import { generateNotionFormulaArgFromProperty } from './property';

export const GenerateArg = {
	literal: generateNotionFormulaArgFromLiteral,
	property: generateNotionFormulaArgFromProperty
};
