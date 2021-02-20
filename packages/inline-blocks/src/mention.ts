import { NotionInlineBlock } from './inlineBlocks';

/**
 * Generate inline mention formatter
 * @param id The id of the mentioned user
 * @returns Generated inline mention formatter
 */
export function notionInlineMentionBlock (id: string) {
	return new NotionInlineBlock([ [ '‣', [ [ 'u', id ] ] ] ]);
}
