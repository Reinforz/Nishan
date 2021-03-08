import { notionSyncRestoreFromFile } from './fromFile';
import { notionSyncRestoreFromMongodb } from './fromMongodb';

export const NotionSyncRestore = {
	file: notionSyncRestoreFromFile,
	mongodb: notionSyncRestoreFromMongodb
};
