import { constructNotionHeaders } from './constructNotionHeaders';
import { createTransaction } from './createTransaction';
import { sendRequest } from './sendRequest';

export const NotionRequest = {
	send: sendRequest,
	constructHeaders: constructNotionHeaders,
	createTransaction
};
