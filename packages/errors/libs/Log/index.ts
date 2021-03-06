import colors from 'colors';

export const NotionErrorsLogs = {
	error: (msg: string) => {
		throw new Error(colors.red.bold(msg));
	},
	warn: (msg: string) => {
		console.log(colors.yellow.bold(msg));
		return msg;
	}
};
