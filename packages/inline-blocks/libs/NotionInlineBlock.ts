import { InlineFormat, TTextFormat } from '@nishans/types';
import { InlineTextStyleFormatter } from './';

export class NotionInlineBlock{
  text: TTextFormat;

	constructor (text?: TTextFormat) {
		this.text = (text ?? []);
  }

  pushToLast(format: InlineFormat){
    // Check if the last chunk contains format, as it might only contain [string], rather than [string, [formats]] if not set it
    if(!this.text[this.text.length - 1][1]) this.text[this.text.length - 1][1] = [format];
    else (this.text[this.text.length - 1][1] as any).push(format)
    return new InlineTextStyleFormatter(this.text);
  }
}