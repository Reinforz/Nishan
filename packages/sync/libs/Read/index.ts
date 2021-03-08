import { readFromFile } from './readFromFile';
import { readFromMongodb } from './readFromMongodb';
import { readFromNotion } from './readFromNotion';

export const NotionSyncRead = {
	fromFile: readFromFile,
	fromMongodb: readFromMongodb,
	fromNotion: readFromNotion
};
