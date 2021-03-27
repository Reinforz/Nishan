import { endpointLogger } from './endpointLogger';
import { errorLogger } from './errorLogger';
import { methodLogger } from './methodLogger';

export const NotionLogger = {
	endpoint: endpointLogger,
	method: methodLogger,
	error: errorLogger
};
