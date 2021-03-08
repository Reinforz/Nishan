import { writeToFile } from './writeToFile';
import { writeToMongodb } from './writeToMongodb';
import { writeToNotion } from './writeToNotion';

export const NotionSyncWrite = {
	toFile: writeToFile,
	toMongodb: writeToMongodb,
	toNotion: writeToNotion
};
