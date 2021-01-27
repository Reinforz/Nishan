import { TDataType, TData, TBlock } from '@nishans/types';
import data from '../data';
import { TestData } from '../types';

export function generateTestData () {
	const TEST_DATA: TestData = {} as any;
	Object.entries(data.recordMap).forEach((entries) => {
		const recordmap_type = entries[0] as TDataType;
		Object.values(entries[1]).forEach(({ value }) => {
			if (recordmap_type === 'block') {
				const block_type = (value as TBlock).type;
				if (!TEST_DATA.block) TEST_DATA.block = {} as any;
				if (!TEST_DATA.block[block_type]) TEST_DATA.block[block_type] = [];
				TEST_DATA.block[block_type].push({
					data: value as any,
					id: {
						correct: (value as TData).id,
						incorrect: (value as TData).id.slice(1)
					},
					type: 'block'
				});
			} else {
				if (!TEST_DATA[recordmap_type]) TEST_DATA[recordmap_type] = [];
				TEST_DATA[recordmap_type].push({
					data: value,
					id: {
						correct: (value as TData).id,
						incorrect: (value as TData).id.slice(1)
					},
					type: recordmap_type
				} as any);
			}
		});
	});
	return TEST_DATA;
}
