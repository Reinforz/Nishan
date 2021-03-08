import { storeInFileFromMongodb } from './fromMongodb';
import { storeInFileFromNotion } from './fromNotion';

export const NotionSyncFileStore = {
	mongodb: storeInFileFromMongodb,
	notion: storeInFileFromNotion
};
