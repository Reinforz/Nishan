import { Node } from 'unist';
import { inlineText } from './inlineBlock';

export function parseParagraphNode (paragraph: Node): string[][] {
	const block = inlineText('');
	(paragraph as any).children.forEach((child: Node) => {
		switch (child.type) {
			case 'text':
				block.add((child as any).value);
				break;
			case 'emphasis':
				block.add((child as any).children[0].value).italic;
				break;
			case 'strong':
				block.add((child as any).children[0].value).bold;
				break;
		}
	});
	return block.text as string[][];
}
