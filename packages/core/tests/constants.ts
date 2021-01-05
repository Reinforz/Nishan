import Nishan from '../dist/Nishan';
import data from './data';

const nishan = new Nishan({
	token: ''
});

nishan.logger = false;
nishan.init_cache = true;
nishan.defaultExecutionState = false;

nishan.saveToCache(data.recordMap);

const USER_ONE_ID = 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
	SPACE_ONE_ID = 'd2498a62-99ed-4ffd-b56d-e986001729f4',
	SPACE_VIEW_ONE_ID = 'ccfc7afe-c14f-4764-9a89-85659217eed7',
	ROOT_PAGE_ONE_ID = '6eae77bf-64cd-4ed0-adfb-e97d928a6402',
	ROOT_COLLECTION_VIEW_PAGE_ONE_ID = '4b4bb21d-f68b-4113-b342-830687a5337a',
	COLLECTION_ONE_ID = 'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b';

export {
	data,
	COLLECTION_ONE_ID,
	SPACE_VIEW_ONE_ID,
	ROOT_COLLECTION_VIEW_PAGE_ONE_ID,
	ROOT_PAGE_ONE_ID,
	USER_ONE_ID,
	SPACE_ONE_ID,
	nishan
};
