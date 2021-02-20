import { InlineFormat, TTextFormat } from '@nishans/types';
import { NotionInlineBlock } from '../src';

/**
 * A class used to format inline text by highlighting their colors and background colors 
 */
export class HighlightColor extends NotionInlineBlock {
	constructor (text?: TTextFormat) {
		super(text);
	}

  addFormat(format: InlineFormat){
    const {StyleFormatter} = require("./StyleFormatter");
    if(!this.content[this.content.length - 1]?.[0])
      throw new Error(`No text content to add format to`);
    if(!this.content[this.content.length - 1][1]) this.content[this.content.length - 1][1] = [format];
    else (this.content[this.content.length - 1][1] as any).push(format)
    return new StyleFormatter(this.content);
  }
  
	get default () {
		return this.addFormat([ 'h', 'default' ]);
	}

	get gray () {
		return this.addFormat([ 'h', 'gray' ]);
	}

	get brown () {
		return this.addFormat([ 'h', 'brown' ]);
	}

	get orange () {
		return this.addFormat([ 'h', 'orange' ]);
	}

	get yellow () {
		return this.addFormat([ 'h', 'yellow' ]);
	}

	get teal () {
		return this.addFormat([ 'h', 'teal' as any ]);
	}

	get blue () {
		return this.addFormat([ 'h', 'blue' ]);
	}

	get purple () {
		return this.addFormat([ 'h', 'purple' ]);
	}

	get pink () {
		return this.addFormat([ 'h', 'pink' ]);
	}

	get red () {
		return this.addFormat([ 'h', 'red' ]);
	}

	get defaultbg () {
		return this.addFormat([ 'h', 'default_background' ]);
	}

	get graybg () {
		return this.addFormat([ 'h', 'gray_background' ]);
	}

	get brownbg () {
		return this.addFormat([ 'h', 'brown_background' ]);
	}

	get orangebg () {
		return this.addFormat([ 'h', 'orange_background' ]);
	}

	get yellowbg () {
		return this.addFormat([ 'h', 'yellow_background' ]);
	}

	get tealbg () {
		return this.addFormat([ 'h', 'teal_background' ]);
	}

	get bluebg () {
		return this.addFormat([ 'h', 'blue_background' ]);
	}

	get purplebg () {
		return this.addFormat([ 'h', 'purple_background' ]);
	}

	get pinkbg () {
		return this.addFormat([ 'h', 'pink_background' ]);
	}

	get redbg () {
		return this.addFormat([ 'h', 'red_background' ]);
	}
}
