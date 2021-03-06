import { TFormulaResultType, TFunctionName, TOperator } from '@nishans/types';

export type IFunctionFormulaSignature = {
	arity?: TFormulaResultType[];
	result_type: TFormulaResultType;
	variadic?: TFormulaResultType;
};

export interface IFunctionFormulaInfo {
	signatures: IFunctionFormulaSignature[];
	function_name: TFunctionName;
	description: string;
	operator?: TOperator;
}
