import { TFormula } from '@nishans/types';
import { FormulaObjectSchemaUnitInput, ISchemaMap } from '..';
import { generateFormulaAST } from './utils';

/**
  * Generates a notion client compatible formula object using an easier object based representation
  * @param formula The simple object representation of the formula
  * @param schema_map A specific schema map of the collection used to reference properties used inside the formula
  * @returns The generated formula ast
 */
export function generateFormulaASTFromObject (
	formula: FormulaObjectSchemaUnitInput['formula'] | boolean | 'e' | 'pi' | string | number | { property: string },
	schema_map?: ISchemaMap
): TFormula {
	return generateFormulaAST(formula, 'object', schema_map);
}
