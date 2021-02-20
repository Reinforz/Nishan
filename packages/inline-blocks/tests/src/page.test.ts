import { NotionInlineBlock } from '../../src';

it('NotionInlineBlock.date', () => {
	expect(NotionInlineBlock.page('123').text).toStrictEqual([ [ '‣', [ [ 'p', '123' ] ] ] ]);
});
