import { ElementType, INotionEndpoints } from '@nishans/types';
import { INotionEndpointsOptions, NotionEndpoints } from '../';

const payload_queries = [
  'getUnvisitedNotificationIds',
  'getNotificationLog',
  'getCsatMilestones',
  'getActivityLog',
  'getAssetsJsonV2',
  'getUserAnalyticsSettings',
  'getPageVisits',
  'getUserSharedPages',
  'getUserSharedPagesInSpace',
  'getPublicPageData',
  'getPublicSpaceData',
  'getSubscriptionData',
  'loadBlockSubtree',
  'getGenericEmbedBlockData',
  'getUploadFileUrl',
  'getBacklinksForBlock',
  'findUser',
  'syncRecordValues',
  'getRecordValues',
  'queryCollection',
  'loadPageChunk',
  'loadCachedPageChunk',
  'recordPageVisit',
  'getUserNotifications',
  'getTasks',
  'search',
  'getClientExperiments',
  'checkEmailType',
  'getBillingHistory',
  'getSamlConfigForSpace',
  'getBots',
  'getInvoiceData',
  'getSnapshotsList',
  'getSnapshotContents',
  'getSignedFileUrls'
] as const;

const payload_less_queries = [
  'getAsanaWorkspaces',
  'getUserTasks',
  'getSpaces',
  'getGoogleDriveAccounts',
  'loadUserContent',
  'getJoinableSpaces',
  'isUserDomainJoinable',
  'isEmailEducation',
  'ping',
  'getAvailableCountries',
  'getConnectedAppsStatus',
  'getDataAccessConsent',
  'getTrelloBoards'
] as const;

type PayloadLessQueries = {
  [Property in keyof Record<ElementType<typeof payload_less_queries>, Record<string, unknown>>]: (options?: INotionEndpointsOptions) => Promise<INotionEndpoints[Property]["response"]>;
};

type PayloadQueries = {
  [Property in keyof Record<ElementType<typeof payload_queries>, Record<string, unknown>>]: (params: INotionEndpoints[Property]["payload"], options?: INotionEndpointsOptions) => Promise<INotionEndpoints[Property]["response"]>;
};

export const NotionEndpointsQueries: PayloadLessQueries & PayloadQueries = {} as any;

payload_less_queries.forEach(payload_less_query=>{
  NotionEndpointsQueries[payload_less_query] = (async (options?: INotionEndpointsOptions) => {
    return await NotionEndpoints.Request.send(
			payload_less_query,
			{},
			options
		);
  }) as any;
});

payload_queries.forEach(payload_query=>{
  NotionEndpointsQueries[payload_query] = (async (params: INotionEndpoints[typeof payload_query]['payload'], options?: INotionEndpointsOptions) =>{
    return await NotionEndpoints.Request.send(
			payload_query,
			params,
			options
		);
  }) as any;
});