import { NotionCore } from '@nishans/core';
import { INotionEndpointsOptions } from '@nishans/endpoints';

export async function initializeNishan ({ token, interval, user_id }: Required<INotionEndpointsOptions>) {
	const nishan = new NotionCore.Api.Nishan({
		token,
		interval
	});

	const notion_user = await nishan.getNotionUser(user_id);

	const context = () => notion_user.getProps();
	return context;
}
