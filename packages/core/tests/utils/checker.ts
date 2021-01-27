import { NotionUser, Space } from '../../src';
import { ITestData, TResult } from '../types';

export function checkSingle<I extends NotionUser | Space> (data: ITestData) {
	return function (instance: I, result: TResult) {
		if (result === 'correct') {
			expect(instance).not.toBeNull();
			expect(instance.id).toBe(data.id.correct);
			expect(instance.type).toBe(data.type);
		} else {
			expect(instance).toBeUndefined();
		}
	};
}

export function checkMultiple<I extends (NotionUser | Space)[]> (data: ITestData) {
	return function (instance: I, result: TResult) {
		if (result === 'correct') {
			expect(instance.length).toBe(1);
			expect(instance[0]).not.toBeNull();
			expect(instance[0].id).toBe(data.id.correct);
			expect(instance[0].type).toBe(data.type);
		} else {
			expect(instance.length).toBe(0);
			expect(instance[0]).toBeUndefined();
		}
	};
}
