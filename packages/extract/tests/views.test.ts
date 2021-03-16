import { NotionExtract, TViewExtracted } from '../libs';

it(`extract views data`, () => {
	const extracted_views_data: TViewExtracted = {
		format: {} as any,
		name: 'View',
		type: 'board',
		query2: {}
	};

	expect(NotionExtract.views([ { ...extracted_views_data, extra: 'data' } as any ])).toStrictEqual([
		extracted_views_data
	]);
});
