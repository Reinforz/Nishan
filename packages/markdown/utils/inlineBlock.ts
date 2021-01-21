import { TFormatBlockColor } from '@nishans/types';

export class Colors {
	text: [[string, string[][]]];

	constructor (text?: [[string, string[][]]]) {
		this.text = (text ?? []) as any;
	}

	get default () {
		this.text[this.text.length - 1][1].push([ 'h', 'default' ]);
		return new chunk(this.text);
	}

	get gray () {
		this.text[this.text.length - 1][1].push([ 'h', 'gray' ]);
		return new chunk(this.text);
	}

	get brown () {
		this.text[this.text.length - 1][1].push([ 'h', 'brown' ]);
		return new chunk(this.text);
	}

	get orange () {
		this.text[this.text.length - 1][1].push([ 'h', 'orange' ]);
		return new chunk(this.text);
	}

	get yellow () {
		this.text[this.text.length - 1][1].push([ 'h', 'yellow' ]);
		return new chunk(this.text);
	}

	get teal () {
		this.text[this.text.length - 1][1].push([ 'h', 'teal' ]);
		return new chunk(this.text);
	}

	get blue () {
		this.text[this.text.length - 1][1].push([ 'h', 'blue' ]);
		return new chunk(this.text);
	}

	get purple () {
		this.text[this.text.length - 1][1].push([ 'h', 'purple' ]);
		return new chunk(this.text);
	}

	get pink () {
		this.text[this.text.length - 1][1].push([ 'h', 'pink' ]);
		return new chunk(this.text);
	}

	get red () {
		this.text[this.text.length - 1][1].push([ 'h', 'red' ]);
		return new chunk(this.text);
	}

	get defaultbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'default_background' ]);
		return new chunk(this.text);
	}

	get graybg () {
		this.text[this.text.length - 1][1].push([ 'h', 'gray_background' ]);
		return new chunk(this.text);
	}

	get brownbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'brown_background' ]);
		return new chunk(this.text);
	}

	get orangebg () {
		this.text[this.text.length - 1][1].push([ 'h', 'orange_background' ]);
		return new chunk(this.text);
	}

	get yellowbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'yellow_background' ]);
		return new chunk(this.text);
	}

	get tealbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'teal_background' ]);
		return new chunk(this.text);
	}

	get bluebg () {
		this.text[this.text.length - 1][1].push([ 'h', 'blue_background' ]);
		return new chunk(this.text);
	}

	get purplebg () {
		this.text[this.text.length - 1][1].push([ 'h', 'purple_background' ]);
		return new chunk(this.text);
	}

	get pinkbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'pink_background' ]);
		return new chunk(this.text);
	}

	get redbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'red_background' ]);
		return new chunk(this.text);
	}
}

export class chunk extends Colors {
	constructor (text?: [[string, string[][]]]) {
		super(text);
	}

	add (title: string) {
		this.text.push([ title, [] ]);
		return new chunk(this.text);
	}

	get strikeThrough () {
		this.text[this.text.length - 1][1].push([ 's' ]);
		return new chunk(this.text);
	}

	get code () {
		this.text[this.text.length - 1][1].push([ 'c' ]);
		return new chunk(this.text);
	}

	get bold () {
		this.text[this.text.length - 1][1].push([ 'b' ]);
		return new chunk(this.text);
	}

	get italic () {
		this.text[this.text.length - 1][1].push([ 'i' ]);
		return new chunk(this.text);
	}

	get underline () {
		this.text[this.text.length - 1][1].push([ '_' ]);
		return new chunk(this.text);
	}

	highlight (color: TFormatBlockColor) {
		this.text[this.text.length - 1][1].push([ 'h', color ]);
		return new chunk(this.text);
	}

	linkTo (url: string) {
		this.text[this.text.length - 1][1].push([ 'a', url ]);
		return new chunk(this.text);
	}
}

export function inlineText (title?: string) {
	return title ? new chunk([ [ title, [] ] ]) : new chunk();
}
