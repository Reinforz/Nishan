import { Nishan } from '@nishans/core';
import { INotionEndpointsOptions } from '@nishans/endpoints';
import { cacheInitializerTracker } from '.';

export async function initializeNishan ({ token, interval, user_id }: Required<INotionEndpointsOptions>) {
	const cache_initializer_tracker = cacheInitializerTracker();
	const nishan = new Nishan({
		token,
		interval
	});

	const notion_user = await nishan.getNotionUser(user_id);
	const context = () => ({ ...notion_user.getProps(), cache_initializer_tracker });
	return context;
}
