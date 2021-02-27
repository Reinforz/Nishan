import { NotionInlineBlock } from '../libs';

describe('NotionInlineBlock ctor', () => {
	it('string arg', () => {
		expect(new NotionInlineBlock('string').content).toStrictEqual([ [ 'string', [] ] ]);
	});

	it('[[string]] arg', () => {
		expect(new NotionInlineBlock([ [ 'string' ] ]).content).toStrictEqual([ [ 'string' ] ]);
	});

	it('undefined arg', () => {
		expect(new NotionInlineBlock().content).toStrictEqual([]);
	});
});

it('text', () => {
	const notion_inline_block = new NotionInlineBlock();
	expect(notion_inline_block.text('123').content).toStrictEqual([ [ '123', [] ] ]);
});

it('mention', () => {
	const notion_inline_block = new NotionInlineBlock();
	expect(notion_inline_block.mention('123').content).toStrictEqual([ [ '‣', [ [ 'u', '123' ] ] ] ]);
});

it('date', () => {
	const notion_inline_block = new NotionInlineBlock();
	expect(notion_inline_block.date({} as any).content).toStrictEqual([ [ '‣', [ [ 'd', {} ] ] ] ]);
});

it('equation', () => {
	const notion_inline_block = new NotionInlineBlock();
	expect(notion_inline_block.equation('e=mc^2').content).toStrictEqual([ [ '⁍', [ [ 'e', 'e=mc^2' ] ] ] ]);
});

it('page', () => {
	const notion_inline_block = new NotionInlineBlock();
	expect(notion_inline_block.page('123').content).toStrictEqual([ [ '‣', [ [ 'p', '123' ] ] ] ]);
});
