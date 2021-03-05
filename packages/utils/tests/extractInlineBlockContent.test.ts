import { NotionUtils } from '../libs';

it(`Works correctly`, () => {
	expect(
		NotionUtils.extractInlineBlockContent([
			[ 'bold', [ [ 'b' ] ] ],
			[ 'italic', [ [ 'i' ], [ 'b' ] ] ],
			[ 'strikethrough', [ [ 's' ] ] ],
			[ 'code', [ [ 'c' ] ] ]
		])
	).toBe('bolditalicstrikethroughcode');
});
