import { NotionInlineBlock } from '../../src';

it('NotionInlineBlock.date', () => {
	expect(NotionInlineBlock.mention('123').text).toStrictEqual([ [ '‣', [ [ 'u', '123' ] ] ] ]);
});
