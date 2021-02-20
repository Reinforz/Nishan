import { InlineDate } from '@nishans/types';
import { NotionInlineBlock } from './inlineBlocks';

/**
 * Generate inline Date formatter
 * @param arg The inline date format
 * @returns Generated inline Date formatter
 */
export function notionInlineDateBlock (arg: InlineDate) {
	return new NotionInlineBlock([ [ '‣', [ [ 'd', arg ] ] ] ]);
}
