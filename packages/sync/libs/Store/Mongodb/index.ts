import { storeInMongodbFromFile } from './fromFile';
import { storeInMongodbFromNotion } from './fromNotion';

export const NotionSyncMongodbStore = {
	fromFile: storeInMongodbFromFile,
	fromNotion: storeInMongodbFromNotion
};
