import { storeInFileFromMongodb } from './fromMongodb';
import { storeInFileFromNotion } from './fromNotion';

export const NotionSyncFileStore = {
	fromMongodb: storeInFileFromMongodb,
	fromNotion: storeInFileFromNotion
};
