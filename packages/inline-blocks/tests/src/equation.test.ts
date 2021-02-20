import { NotionInlineBlock } from '../../src';

it('NotionInlineBlock.date', () => {
	expect(NotionInlineBlock.equation('e=mc^2').text).toStrictEqual([ [ '⁍', [ [ 'e', 'e=mc^2' ] ] ] ]);
});
