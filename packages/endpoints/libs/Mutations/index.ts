import { ElementType, INotionEndpoints } from '@nishans/types';
import { INotionEndpointsOptions, NotionEndpoints } from '../';

const mutation_endpoints = [
  'disconnectTrello',
	'restoreBlock',
	'authWithSlack',
	'authWithTrello',
	'disconnectAsana',
	'authWithAsana',
	'authWithEvernote',
	'authWithGoogleForDrive',
	'setPassword',
	'logoutActiveSessions',
	'deleteUser',
	'sendEmailVerification',
	'sendTemporaryPassword',
	'changeEmail',
	'setDataAccessConsent',
	'updateSubscription',
	'setPageNotificationsAsRead',
	'setSpaceNotificationsAsRead',
	'removeUsersFromSpace',
	'inviteGuestsToSpace',
	'createSpace',
	'saveTransactions',
	'enqueueTask',
	'setBookmarkMetadata',
	'initializePageTemplate',
	'initializeGoogleDriveBlock',
	'loginWithEmail',
	'deleteBlocks',
	'logout',
	'loginWithGoogleAuth',
	'disconnectDrive'
] as const;

type PayloadQueries = {
  [Property in keyof Record<ElementType<typeof mutation_endpoints>, Record<string, unknown>>]: (params: INotionEndpoints[Property]["payload"], options: INotionEndpointsOptions) => Promise<INotionEndpoints[Property]["response"]>;
};

export const NotionEndpointsMutations: PayloadQueries = {} as any;

mutation_endpoints.forEach(mutation_endpoint=>{
  NotionEndpointsMutations[mutation_endpoint] = (async (params: any, options: any) => {
    return await NotionEndpoints.Request.send(
			mutation_endpoint,
			params,
			options
		);
  }) as any;
});
