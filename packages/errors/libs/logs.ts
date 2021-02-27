import colors from 'colors';

export const error = (msg: string) => {
	throw new Error(colors.red.bold(msg));
};
export const warn = (msg: string) => {
	console.log(colors.yellow.bold(msg));
	return msg;
};
