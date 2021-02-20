import { NotionInlineBlock } from './inlineBlocks';

/**
 * Generate inline equation formatter
 * @param arg The inline equation format
 * @returns Generated inline equation formatter
 */
export function notionInlineEquationBlock (equation: string) {
	return new NotionInlineBlock([ [ '⁍', [ [ 'e', equation ] ] ] ]);
}
