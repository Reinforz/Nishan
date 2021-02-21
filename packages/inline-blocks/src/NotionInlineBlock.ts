import { InlineDate, TTextFormat } from '@nishans/types';

/**
 * A class to construct notion inline blocks with provided methods
 */
class NotionInlineBlock {
	content: TTextFormat;

	constructor (content?: string | TTextFormat) {
		// If the passed content parameter is a string, make sure it conforms with the TTextFormat type
		if (typeof content === 'string') this.content = [ [ content, [] ] ];
		else if (Array.isArray(content))
			// Else if its TTextFormat, assign it to the content property
			this.content = content;
		else
			// Else store it as an empty array
			this.content = [];
	}

	/**
   * Adds text content, to the current content, and returns an object that has all text formatting api 
   * @param text The text content to be added to the current content property
   */
	text (text: string) {
		const { StyleFormatter } = require('../libs/StyleFormatter');
		return new StyleFormatter(this.content.concat([ [ text, [] ] ]));
	}

	/**
   * Adds a referenced user content to current content and return a new NotionInlineBlock
   * @param id The id of the person to be added to current content property
   */
	mention (id: string) {
		return new NotionInlineBlock(this.content.concat([ [ '‣', [ [ 'u', id ] ] ] ]));
	}

	/**
   * Adds a referenced page content to current content and return a new NotionInlineBlock
   * @param id The id of the page to be added to current content property
   */
	page (id: string) {
		return new NotionInlineBlock(this.content.concat([ [ '‣', [ [ 'p', id ] ] ] ]));
	}

	/**
   * Adds a referenced date content to current content and return a new NotionInlineBlock
   * @param arg Options for the date that is to be added to current content property
   */
	date (arg: InlineDate) {
		return new NotionInlineBlock(this.content.concat([ [ '‣', [ [ 'd', arg ] ] ] ]));
	}

	/**
   * Adds an equation content to current content and return a new NotionInlineBlock
   * @param equation The equation that is to be added to current content
   */
	equation (equation: string) {
		return new NotionInlineBlock(this.content.concat([ [ '⁍', [ [ 'e', equation ] ] ] ]));
	}
}

export default NotionInlineBlock;
