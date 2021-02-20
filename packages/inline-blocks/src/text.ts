import { TTextFormat } from '@nishans/types';
import { NotionInlineBlock } from './inlineBlocks';

/**
 * Generates an NotionInlineBlock instance using the passed text string
 * @param title The initial content used for formatting
 * @returns An NotionInlineBlock instance
 */
export function notionInlineTextBlock (title?: string | TTextFormat) {
	if (typeof title === 'string') return new NotionInlineBlock([ [ title, [] ] ]);
	else if (Array.isArray(title)) return new NotionInlineBlock(title);
	return new NotionInlineBlock();
}
