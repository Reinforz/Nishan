import { InlineDate, TTextFormat } from '@nishans/types';

class NotionInlineBlock {
	content: TTextFormat;

	constructor (content?: string | TTextFormat) {
		if (typeof content === 'string') this.content = [ [ content, [] ] ];
		else if (Array.isArray(content)) this.content = content;
		else this.content = [];
	}

	text (title: string) {
		const { StyleFormatter } = require('../libs/StyleFormatter');
		return new StyleFormatter(this.content.concat([ [ title, [] ] ]));
	}

	mention (id: string) {
		return new NotionInlineBlock(this.content.concat([ [ '‣', [ [ 'u', id ] ] ] ]));
	}

	page (id: string) {
		return new NotionInlineBlock(this.content.concat([ [ '‣', [ [ 'p', id ] ] ] ]));
	}

	date (arg: InlineDate) {
		return new NotionInlineBlock(this.content.concat([ [ '‣', [ [ 'd', arg ] ] ] ]));
	}

	equation (equation: string) {
		return new NotionInlineBlock(this.content.concat([ [ '⁍', [ [ 'e', equation ] ] ] ]));
	}
}

export default NotionInlineBlock;
