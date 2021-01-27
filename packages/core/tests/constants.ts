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

export { data, TEST_DATA, nishan };
