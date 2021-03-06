import { TFunctionName } from '@nishans/types';
import colors from 'colors';

/**
 * A notion specific error class, that is thrown when the data type doesn't match the supported types
 */
export class UnsupportedFunctionName extends Error {
	/**
   * @param given_function passed function name
   * @param supported_functions The supported function names
   */
	constructor (given_function: string, supported_functions: TFunctionName[]) {
		super(
			colors.bold.red(
				`Function is not supported.\nGiven function: ${given_function}\nSupported functions: ${supported_functions.join(
					' | '
				)}`
			)
		);
	}
}
