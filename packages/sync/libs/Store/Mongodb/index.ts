import { storeInMongodbFromAtlas } from './fromAtlas';
import { storeInMongodbFromFile } from './fromFile';
import { storeInMongodbFromNotion } from './fromNotion';

export const NotionSyncMongodbStore = {
	atlas: storeInMongodbFromAtlas,
	file: storeInMongodbFromFile,
	notion: storeInMongodbFromNotion
};
