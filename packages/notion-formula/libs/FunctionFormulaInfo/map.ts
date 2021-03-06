import { TFunctionName } from '@nishans/types';
import { FunctionFormulaInfo } from './';
import { IFunctionFormulaInfo } from './types';

export const generateNotionFunctionFormulaInfoMap = (): Map<TFunctionName, IFunctionFormulaInfo> =>
	new Map(
		FunctionFormulaInfo.array().map((function_formula_info) => [
			function_formula_info.function_name,
			function_formula_info
		])
	);
