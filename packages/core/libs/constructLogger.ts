import { TDataType } from '@nishans/types';
import colors from 'colors';
import { NishanArg, TMethodType } from '../types';

/**
 * Constructs the logger to be used in all of Nishan's class
 * @param logger The passed logger
 */
export function constructLogger (logger?: NishanArg['logger']) {
	// If the passed arg is false, keep it false
	return logger === false
		? false
		: // Else if the type of the passed arg is function keep it
			typeof logger === 'function'
			? logger
			: // Else use the default logger
				function (method: TMethodType, data_type: TDataType, id: string) {
					// Print the method in red, data_type in green and id in blue
					console.log(`${colors.red(method)} ${colors.green(data_type)} ${colors.blue(id)}`);
				};
}
