import { InlineFormat, TFormatBlockColor, TTextFormat } from '@nishans/types';
import { NotionInlineBlock } from './';
/**
 * A class used to style inline text through their text and background colors
 */
export declare class ITextHighlightColor extends NotionInlineBlock {
	constructor (text?: TTextFormat);
	addFormat (format: InlineFormat): ITextHighlightColor;
	get default (): ITextHighlightColor;
	get gray (): ITextHighlightColor;
	get brown (): ITextHighlightColor;
	get orange (): ITextHighlightColor;
	get yellow (): ITextHighlightColor;
	get teal (): ITextHighlightColor;
	get blue (): ITextHighlightColor;
	get purple (): ITextHighlightColor;
	get pink (): ITextHighlightColor;
	get red (): ITextHighlightColor;
	get defaultbg (): ITextHighlightColor;
	get graybg (): ITextHighlightColor;
	get brownbg (): ITextHighlightColor;
	get orangebg (): ITextHighlightColor;
	get yellowbg (): ITextHighlightColor;
	get tealbg (): ITextHighlightColor;
	get bluebg (): ITextHighlightColor;
	get purplebg (): ITextHighlightColor;
	get pinkbg (): ITextHighlightColor;
	get redbg (): ITextHighlightColor;
}

export declare class ITextStyleFormatter extends ITextHighlightColor {
	constructor (text?: TTextFormat);
	get strikeThrough (): ITextStyleFormatter;
	get code (): ITextStyleFormatter;
	get bold (): ITextStyleFormatter;
	get italic (): ITextStyleFormatter;
	get underline (): ITextStyleFormatter;
	/**
   * Adds a highlight format to the current text content
   * @param color The highlight color, could be for text or background
   */
	highlight (color: TFormatBlockColor): ITextStyleFormatter;
	/**
   * Adds a link format to the current text content
   * @param url The url to link the current text content to
   */
	linkTo (url: string): ITextStyleFormatter;
}
