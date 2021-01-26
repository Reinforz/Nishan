// handles different types of whitespace
import unified from 'unified';
import visit from 'unist-util-visit';
import { Node } from 'unist';

const NEWLINE = '\n';

// default options for plugin
const default_options = {
	tag: '|>'
};

// escape regex special characters
function escapeRegExp (s) {
	return s.replace(new RegExp(`[-[\\]{}()*+?.\\\\^$|/]`, 'g'), '\\$&');
}

// create a node that will compile to HTML
const element = (value: string, children: Node[]) => {
	return {
		type: 'callout',
		value,
		children
	};
};

// passed to unified.use()
// you have to use a named function for access to `this` :(
export default function attacher () {
	const config = default_options;
	const regex = new RegExp(/\|>\s?\[((?:.+?=.+?,?)+)\]/g);
	const escapeTag = new RegExp(escapeRegExp(`\\${config.tag}`), 'g');

	// the tokenizer is called on blocks to determine if there is an callout present and create tags for it
	function blockTokenizer (eat, value: string) {
		// stop if no match or match does not start at beginning of line
		const match = regex.exec(value);
		if (!match || match.index !== 0) return false;

		const [ opening, options ] = match;
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
		const contentNodes = element(content_string, this.tokenizeBlock(content_string));
		exit();

		return add(contentNodes);
	}

	const _this = this as unified.Processor;

	// add tokenizer to parser after fenced code blocks
	const Parser = _this.Parser.prototype;
	Parser.blockTokenizers.callout = blockTokenizer;

	Parser.blockMethods.splice(Parser.blockMethods.indexOf('fencedCode') + 1, 0, 'callout');
	Parser.interruptParagraph.splice(
		Parser.interruptParagraph.map((block: string[]) => block[0]).indexOf('fencedCode') + 1,
		0,
		[ 'callout' ]
	);

	return function transformer (tree: Node) {
		visit(
			tree,
			(node: Node) => {
				return node.type !== 'callout';
			},
			function visitor (node: Node) {
				if (node.value) node.value = (node.value as string).replace(escapeTag, config.tag);
				return node;
			} as any
		);
	};
}
