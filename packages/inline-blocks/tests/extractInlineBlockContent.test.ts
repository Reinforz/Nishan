import { extractInlineBlockContent } from '../libs';

it(`Works correctly`, () => {
	expect(
		extractInlineBlockContent([
			[ 'bold', [ [ 'b' ] ] ],
			[ 'italic', [ [ 'i' ], [ 'b' ] ] ],
			[ 'strikethrough', [ [ 's' ] ] ],
			[ 'code', [ [ 'c' ] ] ]
		])
	).toBe('bolditalicstrikethroughcode');
});
