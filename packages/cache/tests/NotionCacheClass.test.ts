import { NotionCacheClass } from '../src';

import deepEqual from 'deep-equal';
import { RecordMap } from '@nishans/types';

describe('NotionCache class', () => {
	it(`constructor`, () => {
		// It should throw if cache passed is not correct
		expect(
			() =>
				new NotionCacheClass({
					cache: {
						block: new Map()
					}
				} as any)
		).toThrow();

		expect(() => new NotionCacheClass({} as any)).toThrow(`Token not provided`);
	});

	it(`getConfigs method`, () => {
		const notion_cache = new NotionCacheClass({
			token: 'token'
		});

		expect(
			deepEqual(notion_cache.getConfigs(), {
				token: 'token',
				user_id: undefined,
				interval: 500
			})
		).toBe(true);
	});
});
