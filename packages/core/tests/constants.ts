import { TDataType, TData } from '@nishans/types';
import Nishan from '../src';
import data from './data';
import { TestData } from './types';

const nishan = new Nishan({
	token: ''
});

nishan.logger = false;
nishan.init_cache = true;

nishan.saveToCache(data.recordMap);

const root_page_ids: string[] = [],
	non_root_page_ids: string[] = [],
	root_cvp_ids: string[] = [],
	non_root_cvp_ids: string[] = [];

Object.values(data.recordMap.block).forEach(({ value: block }) => {
	if (block.type === 'page' && block.parent_table === 'space') root_page_ids.push(block.id);
	else if (block.type === 'page' && block.parent_table !== 'space') non_root_page_ids.push(block.id);
	else if (block.type === 'collection_view_page' && block.parent_table === 'space') root_cvp_ids.push(block.id);
	else if (block.type === 'collection_view_page' && block.parent_table !== 'space') non_root_cvp_ids.push(block.id);
});

const TEST_DATA: TestData = {} as any;

Object.entries(data.recordMap).forEach((entries) => {
	const key = entries[0] as TDataType;
	TEST_DATA[key] = [];
	Object.entries(entries[1]).forEach(([ type, { value } ]) => {
		TEST_DATA[key].push({
			data: value,
			id: {
				correct: (value as TData).id,
				incorrect: (value as TData).id.slice(1)
			},
			type
		} as any);
	});
});

const USER_ONE_DATA = Object.values(data.recordMap.user_root)[0].value;
const USER_ONE_ID = USER_ONE_DATA.id,
	SPACE_ONE_ID = Object.keys(data.recordMap.space)[0],
	SPACE_VIEW_ONE_ID = Object.keys(data.recordMap.space_view)[0],
	ROOT_PAGE_ONE_ID = root_page_ids[0],
	ROOT_COLLECTION_VIEW_PAGE_ONE_ID = root_cvp_ids[0],
	COLLECTION_ONE_ID = Object.keys(data.recordMap.collection)[0];

export const USER_ONE = {
	data: USER_ONE_DATA,
	id: {
		correct: USER_ONE_ID,
		incorrect: USER_ONE_ID.slice(1)
	}
};

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
