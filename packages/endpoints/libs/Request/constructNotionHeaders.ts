import { INotionEndpointsOptions, NotionHeaders } from '..';

/**
 * Construct notion specific headers using the configs passed
 * @param configs Notion specific data required to construct the header
 * @returns Notion specific header
 */
export function constructNotionHeaders (configs?: INotionEndpointsOptions): NotionHeaders {
	const headers: NotionHeaders = {
		headers: {}
	} as any;

	if (configs?.token) headers.headers.cookie = `token_v2=${configs.token};`;
	if (configs?.user_id) {
		if (!headers.headers.cookie) headers.headers.cookie = '';
		headers.headers.cookie += `notion_user_id=${configs.user_id};`;
		headers.headers['x-notion-active-user-header'] = configs.user_id;
	}
	return headers;
}