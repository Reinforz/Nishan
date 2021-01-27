import { TDataType, TData } from '@nishans/types';
import data from '../data';
import { TestData } from '../types';

export function generateTestData () {
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
	return TEST_DATA;
}
