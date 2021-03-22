import { ISchemaMap, TFormula } from '@nishans/types';
import { FormulaArraySchemaUnitInput } from '../';
import { generateNotionFormulaAST } from './utils';

/**
 * Generates a notion client compatible formula object using an easier object based representation
 * @param formula The simple array representation of the formula
 * @param schema_map A specific schema map of the collection used to reference properties used inside the formula
 * @returns The generated formula ast
 */
export function generateFormulaASTFromArray (
	formula: FormulaArraySchemaUnitInput['formula'] | boolean | 'e' | 'pi' | string | number | { property: string },
	schema_map?: ISchemaMap
): TFormula {
	return generateNotionFormulaAST(formula, 'array', schema_map);
}
