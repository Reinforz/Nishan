import { NotionUtils } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`Should work for object source and target`, () => {
	expect(NotionUtils.deepMerge({ a: { b: 2, c: 3 } }, { a: { b: 1 } })).toStrictEqual({
		a: {
			b: 1,
			c: 3
		}
	});
});

it(`Should work for non object source`, () => {
	expect(NotionUtils.deepMerge({ a: { b: 2, c: 3 } }, false)).toStrictEqual({ a: { b: 2, c: 3 } });
});

it(`Should work for source key not in target`, () => {
	expect(NotionUtils.deepMerge({ a: { b: 2, c: 3 } }, { b: { c: 1 } })).toStrictEqual({
		a: { b: 2, c: 3 },
		b: { c: 1 }
	});
});
