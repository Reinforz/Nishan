import { NotionInlineBlock } from './inlineBlocks';

/**
 * Generate inline page formatter
 * @param id The id of the page
 * @returns Generated inline page formatter
 */
export function notionInlinePageBlock (id: string) {
	return new NotionInlineBlock([ [ '‣', [ [ 'p', id ] ] ] ]);
}
