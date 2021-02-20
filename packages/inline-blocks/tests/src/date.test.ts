import { NotionInlineBlock } from '../../src';

it('NotionInlineBlock.date', () => {
	expect(NotionInlineBlock.date({} as any).text).toStrictEqual([ [ '‣', [ [ 'd', {} ] ] ] ]);
});
