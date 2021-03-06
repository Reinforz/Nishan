import { TFormulaResultType, TFunctionName } from '@nishans/types';
import colors from 'colors';

/**
 * Thrown when a mismatched formula result types is used as an argument to a formula function
 */
export class FunctionArgumentTypeMismatch extends Error {
	/**
   * @param result_type Given result type
   * @param arg_num Argument number
   * @param function_name Name of the function
   */
	constructor (result_type: TFormulaResultType, arg_num: number, function_name: TFunctionName) {
		super(
			colors.bold.red(
				`Argument of type ${result_type} can't be used as argument ${arg_num} for function ${function_name}.`
			)
		);
	}
}
