import { NotionSyncFileStore } from './File';
import { NotionSyncMongodbStore } from './Mongodb';

export const NotionSyncStore = {
	File: NotionSyncFileStore,
	Mongodb: NotionSyncMongodbStore
};
