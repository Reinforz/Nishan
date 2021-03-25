export * from './types';

import { constructAndSyncRecordsParams } from './constructAndSyncRecordsParams';
import { constructSyncRecordsParams } from './constructSyncRecordsParams';
import { createDefaultCache } from './createDefaultCache';
import { createDefaultCacheInitializeTracker } from './createDefaultCacheInitializeTracker';
import { extractNotionUserIds } from './extractNotionUserIds';
import { extractSpaceAndParentId } from './extractSpaceAndParentId';
import { fetchDataOrReturnCached } from './fetchDataOrReturnCached';
import { fetchMultipleDataOrReturnCached } from './fetchMultipleDataOrReturnCached';
import { initializeCacheForSpecificData } from './initializeCacheForSpecificData';
import { initializeNotionCache } from './initializeNotionCache';
import { returnNonCachedData } from './returnNonCachedData';
import { saveToCache } from './saveToCache';
import { updateCacheIfNotPresent } from './updateCacheIfNotPresent';
import { updateCacheManually } from './updateCacheManually';
import { validateCache } from './validateCache';

export const NotionCache = {
	validateCache,
	updateCacheManually,
	updateCacheIfNotPresent,
	saveToCache,
	returnNonCachedData,
	initializeNotionCache,
	constructAndSyncRecordsParams,
	constructSyncRecordsParams,
	createDefaultCache,
	extractNotionUserIds,
	extractSpaceAndParentId,
	fetchDataOrReturnCached,
	fetchMultipleDataOrReturnCached,
	initializeCacheForSpecificData,
	createDefaultCacheInitializeTracker
};
