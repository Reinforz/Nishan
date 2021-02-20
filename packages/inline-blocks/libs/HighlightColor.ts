import { NotionInlineBlock } from './NotionInlineBlock';

/**
 * A class used to format inline text by highlighting their colors and background colors 
 */
export class HighlightColors extends NotionInlineBlock {
	get default () {
		return this.pushToLast([ 'h', 'default' ]);
	}

	get gray () {
		return this.pushToLast([ 'h', 'gray' ]);
	}

	get brown () {
		return this.pushToLast([ 'h', 'brown' ]);
	}

	get orange () {
		return this.pushToLast([ 'h', 'orange' ]);
	}

	get yellow () {
		return this.pushToLast([ 'h', 'yellow' ]);
	}

	get teal () {
		return this.pushToLast([ 'h', 'teal' as any ]);
	}

	get blue () {
		return this.pushToLast([ 'h', 'blue' ]);
	}

	get purple () {
		return this.pushToLast([ 'h', 'purple' ]);
	}

	get pink () {
		return this.pushToLast([ 'h', 'pink' ]);
	}

	get red () {
		return this.pushToLast([ 'h', 'red' ]);
	}

	get defaultbg () {
		return this.pushToLast([ 'h', 'default_background' ]);
	}

	get graybg () {
		return this.pushToLast([ 'h', 'gray_background' ]);
	}

	get brownbg () {
		return this.pushToLast([ 'h', 'brown_background' ]);
	}

	get orangebg () {
		return this.pushToLast([ 'h', 'orange_background' ]);
	}

	get yellowbg () {
		return this.pushToLast([ 'h', 'yellow_background' ]);
	}

	get tealbg () {
		return this.pushToLast([ 'h', 'teal_background' ]);
	}

	get bluebg () {
		return this.pushToLast([ 'h', 'blue_background' ]);
	}

	get purplebg () {
		return this.pushToLast([ 'h', 'purple_background' ]);
	}

	get pinkbg () {
		return this.pushToLast([ 'h', 'pink_background' ]);
	}

	get redbg () {
		return this.pushToLast([ 'h', 'red_background' ]);
	}
}
