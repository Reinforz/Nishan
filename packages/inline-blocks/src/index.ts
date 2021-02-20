import { notionInlineDateBlock } from './date';
import { notionInlineEquationBlock } from './equation';
import { notionInlineMentionBlock } from './mention';
import { notionInlinePageBlock } from './page';
import { notionInlineTextBlock } from './text';

export const NotionInlineBlock = {
	date: notionInlineDateBlock,
	page: notionInlinePageBlock,
	equation: notionInlineEquationBlock,
	text: notionInlineTextBlock,
	mention: notionInlineMentionBlock
};
