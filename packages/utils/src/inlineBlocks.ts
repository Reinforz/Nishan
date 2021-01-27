import { InlineDate, InlineFormat, TFormatBlockColor, TTextFormat } from '@nishans/types';

export function inlineDate (arg: InlineDate) {
  return new InlineTextFormatter([ [ '‣', [ [ 'd', arg ] ] ] ]);
}

export function inlineMention (id: string) {
	return new InlineTextFormatter([ [ '‣', [ [ 'u', id ] ] ] ]);
}

export function inlinePage (id: string) {
	return new InlineTextFormatter([ [ '‣', [ [ 'p', id ] ] ] ]);
}

export function inlineEquation (equation: string) {
	return new InlineTextFormatter([ [ '⁍', [ [ 'e', equation ] ] ] ]);
}

export class HighlightColors {
	text: TTextFormat;

	constructor (text?: TTextFormat) {
		this.text = (text ?? []);
  }
  
  pushToLast(format: InlineFormat){
    if(!this.text[this.text.length - 1][1]) this.text[this.text.length - 1][1] = [format];
    else this.text[this.text.length - 1][1]?.push(format)
    return new InlineTextFormatter(this.text);
  }

	get default () {
    return this.pushToLast(['h', 'default'])
	}

	get gray () {
    return this.pushToLast(['h', 'gray'])
	}

	get brown () {
    return this.pushToLast(['h', 'brown'])
	}

	get orange () {
    return this.pushToLast(['h', 'orange'])
	}

	get yellow () {
    return this.pushToLast(['h', 'yellow'])
	}

	get teal () {
    return this.pushToLast(['h', 'teal' as any])
	}

	get blue () {
    return this.pushToLast(['h', 'blue'])
	}

	get purple () {
    return this.pushToLast(['h', 'purple'])
	}

	get pink () {
    return this.pushToLast(['h', 'pink'])
	}

	get red () {
    return this.pushToLast(['h', 'red'])
	}

	get defaultbg () {
    return this.pushToLast(['h', 'default_background'])
	}

	get graybg () {
    return this.pushToLast(['h', 'gray_background'])
	}

	get brownbg () {
    return this.pushToLast(['h', 'brown_background'])
	}

	get orangebg () {
    return this.pushToLast(['h', 'orange_background'])
	}

	get yellowbg () {
    return this.pushToLast(['h', 'yellow_background'])
	}

	get tealbg () {
    return this.pushToLast(['h', 'teal_background'])
	}

	get bluebg () {
    return this.pushToLast(['h', 'blue_background'])
	}

	get purplebg () {
    return this.pushToLast(['h', 'purple_background'])
	}

	get pinkbg () {
    return this.pushToLast(['h', 'pink_background'])
	}

	get redbg () {
    return this.pushToLast(['h', 'red_background'])
	}
}

export class InlineTextFormatter extends HighlightColors {
	constructor (text?: TTextFormat) {
		super(text);
	}

	add (title: string) {
		this.text.push([ title, [] ]);
		return new InlineTextFormatter(this.text);
	}

	get strikeThrough () {
    return this.pushToLast(['s']);
	}

	get code () {
    return this.pushToLast(['c']);
	}

	get bold () {
    return this.pushToLast(['b']);
	}

	get italic () {
    return this.pushToLast(['i']);
	}

	get underline () {
    return this.pushToLast(['_']);
	}

	highlight (color: TFormatBlockColor) {
    return this.pushToLast(['h', color]);
	}

	linkTo (url: string) {
    return this.pushToLast(['a', url]);
	}
}

export function inlineText (title?: string) {
	return title ? new InlineTextFormatter([ [ title, [] ] ]) : new InlineTextFormatter();
}
