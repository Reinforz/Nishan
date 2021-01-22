import { InlineDate, TFormatBlockColor } from './';

export type InlineBoldFormat = ['b'];
export type InlineItalicFormat = ['i'];
export type InlineStrikeFormat = ['s'];
export type InlineCodeFormat = ['c'];
export type InlineUnderlineFormat = ['_'];
export type InlineLinkFormat = ['a', string];
export type InlineHighlightFormat = ['h', TFormatBlockColor];
export type InlineMentionFormat = ['u', string];
export type InlinePageFormat = ['p', string];
export type InlineEquationFormat = ['e', string];
export type InlineDateFormat = ['d', InlineDate];

export type InlineFormat =
	| InlineBoldFormat
	| InlineItalicFormat
	| InlineStrikeFormat
	| InlineCodeFormat
	| InlineUnderlineFormat
	| InlineLinkFormat
	| InlineHighlightFormat
	| InlineDateFormat
	| InlineMentionFormat
	| InlineEquationFormat
	| InlinePageFormat;

export type TTextFormat = [string, InlineFormat] | [string];
