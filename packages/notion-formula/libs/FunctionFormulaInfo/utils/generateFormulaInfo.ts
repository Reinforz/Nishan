import { TFormulaResultType, TFunctionName, TOperator } from '@nishans/types';
import { IFunctionFormulaInfo } from '../types';

export function generateFormulaInfo (
	description: string,
	function_name: TFunctionName,
	signatures: [TFormulaResultType, TFormulaResultType[]][],
	operator?: TOperator
): IFunctionFormulaInfo {
	return {
		description,
		operator,
		function_name,
		signatures: signatures.map(([ result_type, arity ]) => ({ arity, result_type }))
	};
}
