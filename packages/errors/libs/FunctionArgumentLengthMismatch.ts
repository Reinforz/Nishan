import { TFunctionName } from '@nishans/types';
import colors from 'colors';

/**
 * Thrown when a mismatched formula result types is used as an argument to a formula function
 */
export class FunctionArgumentLengthMismatch extends Error {
	/**
   * @param given_arg_amount Given argument amount
   * @param expected_arg_amount Expected argument amount
   * @param function_name Name of the function
   */
	constructor (given_arg_amount: number, expected_args_amount: number[], function_name: TFunctionName) {
		super(
			colors.bold.red(
				`Function ${function_name} takes ${expected_args_amount.join(',')} arguments, given ${given_arg_amount}`
			)
		);
	}
}
