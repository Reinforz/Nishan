const regex = /^\|>\s?\[(?<config>(?:.+?=.+?,?)+)\]$/m;

export default function plugin () {
	function defaultTokenizer (eat, value: string) {
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
	const blockTokenizers = Parser.prototype.blockTokenizers;
	const blockMethods = Parser.prototype.blockMethods;

	const insertPoint = blockMethods.indexOf('fencedCode') + 1;

	blockTokenizers.container = defaultTokenizer;
	blockMethods.splice(insertPoint, 0, 'container');
}
