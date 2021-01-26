const regex = /^\|>\s?\[(?<config>(?:.+?=.+?,?)+)\]$/m;

function whitespace (character: string | number) {
	return /\s/.test(typeof character === 'number' ? String.fromCharCode(character) : character.charAt(0));
}

export default function plugin () {
  const UNDERLINE_CHAR = '-',
		DOUBLE_UNDERLINE_CHAR = UNDERLINE_CHAR + UNDERLINE_CHAR;

  function locator (value: string, fromIndex: number) {
    return value.indexOf(DOUBLE_UNDERLINE_CHAR, fromIndex);
  }

  function underlineTokenizer (eat, value: string) {
		if (
			// Checks to see if value starts with
			!value.startsWith(DOUBLE_UNDERLINE_CHAR) ||
			value.startsWith(DOUBLE_UNDERLINE_CHAR + DOUBLE_UNDERLINE_CHAR) ||
			whitespace(value.charAt(2))
		) {
			return;
		}

    let current = '', 
      previous = '', 
      preceding = '', 
      subvalue = '', 
      index = 1;
		const length = value.length;
		const now = eat.now();
		now.column += 2;
		now.offset += 2;

		while (++index < length) {
			current = value.charAt(index);

			if (current === UNDERLINE_CHAR && previous === UNDERLINE_CHAR && (!preceding || !whitespace(preceding))) {
				return eat(DOUBLE_UNDERLINE_CHAR + subvalue + DOUBLE_UNDERLINE_CHAR)({
					type: 'underline',
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					children: this.tokenizeInline(subvalue, now)
				});
			}

			subvalue += previous;
			preceding = previous;
			previous = current;
		}
	}

	function calloutTokenizer (eat, value: string) {
		if (value.trim().startsWith('|>')) {
			const m = regex.exec(value.trim());
			if (m) {
				const config = m?.groups?.config;
				const container: string[] = [];

        let i = 0;
        const lines = value.split('\n')

        while(i <= lines.length){
          const line = lines[i++]
          container.push(line)
          // found end of nested container
          if (line.trim() === '|>') break;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const self = this;
        const exit = self.enterBlock();
				const body = container.slice(1, container.length - 1).join('\n');
				const add = eat(container.join('\n'));

				const node = {
					type: 'callout',
          config,
					children: self.tokenizeBlock(body, eat.now())
				};

				add(node);
				exit();
			}
		}
	}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
	const Parser = this.Parser;
	const {blockTokenizers, inlineTokenizers} = Parser.prototype;
	const {blockMethods, inlineMethods} = Parser.prototype;

	blockTokenizers.container = calloutTokenizer;
  blockMethods.splice(blockMethods.indexOf('fencedCode'), 0, 'container');
  
  inlineTokenizers.underline = underlineTokenizer;
	underlineTokenizer.locator = locator;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'underline');
}
