import { TFormatBlockColor, TTextFormat } from '@nishans/types';
import { TextHighlightColor } from './';
import { ITextStyleFormatter } from './types';

/**
 * A class to add text style formatters
 */
export class TextStyleFormatter extends TextHighlightColor implements ITextStyleFormatter {
	constructor (text?: TTextFormat) {
		super(text);
	}

	get strikeThrough () {
		return this.addFormat([ 's' ]);
	}

	get code () {
		return this.addFormat([ 'c' ]);
	}

	get bold () {
		return this.addFormat([ 'b' ]);
	}

	get italic () {
		return this.addFormat([ 'i' ]);
	}

	get underline () {
		return this.addFormat([ '_' ]);
	}

	/**
   * Adds a highlight format to the current text content
   * @param color The highlight color, could be for text or background
   */
	highlight (color: TFormatBlockColor) {
		return this.addFormat([ 'h', color ]);
	}

	/**
   * Adds a link format to the current text content
   * @param url The url to link the current text content to
   */
	linkTo (url: string) {
		return this.addFormat([ 'a', url ]);
	}
}
