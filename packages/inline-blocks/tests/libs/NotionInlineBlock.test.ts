import { NotionInlineBlock } from '../../libs';

describe('addFormat', () => {
	it(`Should work if format array doesn't exist`, () => {
		const notion_inline_block = new NotionInlineBlock([ [ 'text' ] ]);
		notion_inline_block.addFormat([ '_' ]);
		notion_inline_block.addFormat([ 'b' ]);
		expect(notion_inline_block.text).toStrictEqual([ [ 'text', [ [ '_' ], [ 'b' ] ] ] ]);
	});

	it(`Should throw error if no text content exists`, () => {
		const notion_inline_block = new NotionInlineBlock();
		expect(() => notion_inline_block.addFormat([ '_' ])).toThrow(`No text content to add format to`);
	});
});

it(`add`, () => {
	const notion_inline_block = new NotionInlineBlock();
	notion_inline_block.add('text 2');
	expect(notion_inline_block.text).toStrictEqual([ [ 'text 2', [] ] ]);
});
