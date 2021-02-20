import { TFormatBlockColor, TTextFormat } from '@nishans/types';
import { HighlightColors } from './HighlightColor';

/**
 * A class to add inline text formatters
 */
export class InlineTextStyleFormatter extends HighlightColors {
	constructor (text?: TTextFormat) {
		super(text);
	}

	add (title: string) {
		this.text.push([ title, [] ]);
		return new InlineTextStyleFormatter(this.text);
	}

	get strikeThrough () {
		return this.pushToLast([ 's' ]);
	}

	get code () {
		return this.pushToLast([ 'c' ]);
	}

	get bold () {
		return this.pushToLast([ 'b' ]);
	}

	get italic () {
		return this.pushToLast([ 'i' ]);
	}

	get underline () {
		return this.pushToLast([ '_' ]);
	}

	highlight (color: TFormatBlockColor) {
		return this.pushToLast([ 'h', color ]);
	}

	linkTo (url: string) {
		return this.pushToLast([ 'a', url ]);
	}
}
