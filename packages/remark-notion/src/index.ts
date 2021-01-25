// handles different types of whitespace
import unified from 'unified';

const NEWLINE = '\n';

// natively supported types
const types = {
	// base types
	note: {
		keyword: 'note',
		emoji: 'ℹ️', // '&#x2139;'
		svg: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"></svg>'
	}
};

// default options for plugin
const default_options = {
	tag: ':::'
};

// override default options
const configure = (custom_options) => {
	return {
		...default_options,
		...custom_options,
		types
	};
};

// escape regex special characters
function escapeRegExp (s) {
	return s.replace(new RegExp(`[-[\\]{}()*+?.\\\\^$|/]`, 'g'), '\\$&');
}

// create a node that will compile to HTML
const element = (value: string) => {
	return {
		type: 'callout',
		value
	};
};

// changes the first character of a keyword to uppercase so that custom title
// styles may omit `text-transform: uppercase`.
const formatKeyword = (keyword) => keyword.charAt(0).toUpperCase() + keyword.slice(1);

// passed to unified.use()
// you have to use a named function for access to `this` :(
export default function attacher (options) {
	const config = configure(options);

	// match to determine if the line is an opening tag
	const keywords = Object.keys(config.types).map(escapeRegExp).join('|');
	const tag = escapeRegExp(config.tag);
	const regex = new RegExp(`${tag}(${keywords})(?: *(.*))?\n`);
	const escapeTag = new RegExp(escapeRegExp(`\\${config.tag}`), 'g');

	// the tokenizer is called on blocks to determine if there is an admonition present and create tags for it
	function blockTokenizer (eat, value) {
		// stop if no match or match does not start at beginning of line
		const match = regex.exec(value);
		if (!match || match.index !== 0) return false;

		const [ opening ] = match;
		const food: string[] = [],
			content: string[] = [];

		// consume lines until a closing tag
		let idx = 0;
		while ((idx = value.indexOf(NEWLINE)) !== -1) {
			// grab this line and eat it
			const next = value.indexOf(NEWLINE, idx + 1);
			const line = next !== -1 ? value.slice(idx + 1, next) : value.slice(idx + 1);
			food.push(line);
			value = value.slice(idx + 1);
			// the closing tag is NOT part of the content
			if (line.startsWith(config.tag)) break;
			content.push(line);
		}

		// consume the processed tag and replace escape sequences
		const content_string = content.join(NEWLINE).replace(escapeTag, config.tag);
		const add = eat(opening + food.join(NEWLINE));

		// parse the content in block mode
		const exit = this.enterBlock();
		const contentNodes = element(content_string);
		exit();

		return add(contentNodes);
	}

	const _this = this as unified.Processor;

	// add tokenizer to parser after fenced code blocks
	const Parser = _this.Parser.prototype;
	Parser.blockTokenizers.admonition = blockTokenizer;

	Parser.blockMethods.splice(Parser.blockMethods.indexOf('fencedCode') + 1, 0, 'admonition');
}
