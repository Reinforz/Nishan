import colors from 'colors';
import { NotionLogger } from '.';

export const errorLogger = (msg: string) => {
	NotionLogger.method.error(msg);
	throw new Error(colors.red.bold(msg));
};
