import { TTextFormat } from '@nishans/types';

export function extractInlineBlockContent (inline_block: TTextFormat) {
	return inline_block.reduce((prev, current) => prev + current[0], '');
}
