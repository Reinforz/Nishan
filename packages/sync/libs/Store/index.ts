import { NotionSyncFileStore } from './File';
import { NotionSyncMongodbStore } from './Mongodb';

export const NotionSyncStore = {
	InFile: NotionSyncFileStore,
	InMongodb: NotionSyncMongodbStore
};
