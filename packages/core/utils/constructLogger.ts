import { NishanArg, TMethodType } from '../types';
import colors from 'colors';
import { TDataType } from '@nishans/types';

export function constructLogger (logger?: NishanArg['logger']) {
	return logger === false
		? false
		: typeof logger === 'function'
			? logger
			: function (method: TMethodType, subject: TDataType, id: string) {
					console.log(`${colors.red(method)} ${colors.green(subject)} ${colors.blue(id)}`);
				};
}
