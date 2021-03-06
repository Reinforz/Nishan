import { constructNotionHeaders } from './constructNotionHeaders';
import { createTransaction } from './createTransaction';
import { sendRequest } from './sendRequest';

export const NotionEndpointsRequest = {
	send: sendRequest,
	constructHeaders: constructNotionHeaders,
	createTransaction
};
