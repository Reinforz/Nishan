import { NotionExtract, PageExtracted } from '../libs';

describe('pages', () => {
	it(`is_template=true`, () => {
		const extracted_page_data: PageExtracted = {
			properties: {
				title: [ [ 'Title' ] ]
			},
			format: {},
			is_template: true
		};

		expect(NotionExtract.pages([ { ...extracted_page_data, extra: 'data' } ] as any)).toStrictEqual([
			extracted_page_data
		]);
	});

	it(`is_template=undefined`, () => {
		const extracted_page_data: PageExtracted = {
			properties: {
				title: [ [ 'Title' ] ]
			},
			format: {}
		};

		expect(NotionExtract.pages([ { ...extracted_page_data, extra: 'data' } ] as any)).toStrictEqual([
			{ ...extracted_page_data, is_template: false }
		]);
	});
});
