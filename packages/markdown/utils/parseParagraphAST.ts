import { Node } from 'unist';
import { inlineText } from './inlineBlock';

export function parseParagraphAST (paragraph: Node): string[][] {
	const block = inlineText('');
	(paragraph as any).children.forEach((child: Node) => {
		switch (child.type) {
			case 'text':
				block.add((child as any).value);
				break;
		}
	});
	return block.text as string[][];
}
