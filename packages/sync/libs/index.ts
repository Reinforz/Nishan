import { NotionSyncRestore } from './Restore';
import { NotionSyncStore } from './Store';

export * from './types';

export const NotionSync = {
	Store: NotionSyncStore,
	Restore: NotionSyncRestore
};
