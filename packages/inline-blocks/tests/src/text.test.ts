import { NotionInlineBlock } from '../../src';

it('NotionInlineBlock.text', () => {
	describe('string arg', () => {
		expect(NotionInlineBlock.text('string').text).toStrictEqual([ [ 'string', [] ] ]);
	});

	describe('[[string]] arg', () => {
		expect(NotionInlineBlock.text([ [ 'string' ] ]).text).toStrictEqual([ [ 'string' ] ]);
	});

	describe('undefiend arg', () => {
		expect(NotionInlineBlock.text().text).toStrictEqual([]);
	});
});
