import { notionSyncRestoreFromFile } from './fromFile';
import { notionSyncRestoreFromMongodb } from './fromMongodb';

export const NotionSyncRestore = {
	fromFile: notionSyncRestoreFromFile,
	fromMongodb: notionSyncRestoreFromMongodb
};
