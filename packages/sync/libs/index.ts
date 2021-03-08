import { ExtractData } from './ExtractData';
import { NotionSyncRead } from './Read';
import { NotionSyncRestore } from './Restore';
import { NotionSyncStore } from './Store';
import { NotionSyncWrite } from './Write';

export * from './types';

export const NotionSync = {
	Store: NotionSyncStore,
	Restore: NotionSyncRestore,
	Write: NotionSyncWrite,
	Read: NotionSyncRead,
	ExtractData
};
