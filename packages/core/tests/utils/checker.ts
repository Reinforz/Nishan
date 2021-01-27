import { NotionUser } from '../../src';
import { TEST_DATA } from '../constants';
import { TResult } from '../types';

export function checkSingle<D extends NotionUser> (data: D, result: TResult) {
	if (result === 'correct') {
		expect(data).not.toBeNull();
		expect(data.id).toBe(TEST_DATA.notion_user[0].id.correct);
		expect(data.type).toBe('notion_user');
	} else {
		expect(data).toBeUndefined();
	}
}

export function checkMultiple<D extends NotionUser[]> (data: D, result: TResult) {
	if (result === 'correct') {
		expect(data.length).toBe(1);
		expect(data[0]).not.toBeNull();
		expect(data[0].id).toBe(TEST_DATA.notion_user[0].id.correct);
		expect(data[0].type).toBe('notion_user');
	} else {
		expect(data.length).toBe(0);
		expect(data[0]).toBeUndefined();
	}
}
