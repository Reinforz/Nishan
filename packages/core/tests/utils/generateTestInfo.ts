import { TData } from '@nishans/types';
import { NotionUser } from '../../src';
import { ITestData, TestInfo } from '../types';
import { checkSingle, checkMultiple } from './checker';

export function generateTestInfo<D extends TData, C extends NotionUser, M extends [string, string]> (
	methods: [string, string],
	test_data: ITestData[]
): TestInfo<D, C, M> {
	return {
		single: {
			correct: {
				id: test_data[0].id.correct,
				cb: (data) => data.id === test_data[0].id.correct
			},
			incorrect: {
				id: test_data[0].id.incorrect,
				cb: (data) => data.id === test_data[0].id.incorrect
			},
			method: methods[0],
			checker: checkSingle(test_data[0])
		},
		multiple: {
			correct: {
				id: [ test_data[0].id.correct ],
				cb: (data) => data.id === test_data[0].id.correct
			},
			incorrect: {
				id: [ test_data[0].id.incorrect ],
				cb: (data) => data.id === test_data[0].id.incorrect
			},
			method: methods[1],
			checker: checkMultiple(test_data[0])
		}
	};
}
