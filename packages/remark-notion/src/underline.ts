const DEFAULT_LEFT = '-';
const DEFAULT_RIGHT = '-';

function whitespace (character) {
	return /\s/.test(typeof character === 'number' ? String.fromCharCode(character) : character.charAt(0));
}

export default function plugin () {
	const CHAR_LEFT = DEFAULT_LEFT;
	const CHAR_RIGHT = DEFAULT_RIGHT;

	const DOUBLE_LEFT = CHAR_LEFT + CHAR_LEFT;
	const DOUBLE_RIGHT = CHAR_RIGHT + CHAR_RIGHT;

	function locator (value, fromIndex) {
		const index = value.indexOf(DOUBLE_LEFT, fromIndex);
		return index;
	}

	function inlineTokenizer (eat, value) {
		if (
			!this.options.gfm ||
			value.substr(0, 2) !== DOUBLE_LEFT ||
			value.substr(0, 4) === DOUBLE_LEFT + DOUBLE_RIGHT ||
			whitespace(value.charAt(2))
		) {
			return;
		}

		let character = '';
		let previous = '';
		let preceding = '';
		let subvalue = '';
		let index = 1;
		const length = value.length;
		const now = eat.now();
		now.column += 2;
		now.offset += 2;

		while (++index < length) {
			character = value.charAt(index);

			if (character === CHAR_RIGHT && previous === CHAR_RIGHT && (!preceding || !whitespace(preceding))) {
				return eat(DOUBLE_LEFT + subvalue + DOUBLE_RIGHT)({
					type: 'underline',
					children: this.tokenizeInline(subvalue, now)
				});
			}

			subvalue += previous;
			preceding = previous;
			previous = character;
		}
	}

	inlineTokenizer.locator = locator;

	const Parser = this.Parser.prototype;

	Parser.inlineTokenizers.underline = inlineTokenizer;
	const inlineMethods = Parser.inlineMethods;
	inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'underline');
}

module.exports = plugin;
