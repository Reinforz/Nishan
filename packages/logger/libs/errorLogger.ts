import colors from 'colors';

export const errorLogger = (msg: string) => {
	throw new Error(colors.red.bold(msg));
};
