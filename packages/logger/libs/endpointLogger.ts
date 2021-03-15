import colors from 'colors';
import { createLogger, format, transports } from 'winston';

const { combine, colorize, timestamp, printf } = format;

export const endpointLogger = createLogger({
	level: 'info',
	format: combine(
		colorize(),
		timestamp({
			format: 'HH:mm:ss'
		}),
		printf(
			({ level, message, timestamp }) => `${colors.blue.bold(timestamp)} - ${level}: ${colors.bold.white(message)}`
		)
	),
	transports: [ new transports.Console() ]
});
