import { TFormatBlockColor, TTextFormat } from '@nishans/types';
import { HighlightColor } from './HighlightColor';

/**
 * A class to add inline text formatters
 */
export class StyleFormatter extends HighlightColor {
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

	highlight (color: TFormatBlockColor) {
		return this.addFormat([ 'h', color ]);
	}

	linkTo (url: string) {
		return this.addFormat([ 'a', url ]);
	}
}
