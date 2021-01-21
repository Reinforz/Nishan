import { Node } from 'unist';
import { inlineText, chunk } from './inlineBlock';

export function parseParagraphNode (paragraph: Node): string[][] {
	const block = inlineText('');

	function inner (block: chunk, parent: Node, formats: ('bold' | 'italic')[]) {
		(parent as any).children.forEach((child: Node) => {
			switch (child.type) {
				case 'text':
					block.add((child as any).value);
					formats.forEach((format) => {
						if (format === 'bold') block.bold;
						else if (format === 'italic') block.italic;
					});
					break;
				case 'emphasis':
					inner(block, child as any, formats.concat('italic'));
					break;
				case 'strong':
					inner(block, child as any, formats.concat('bold'));
					break;
				case 'inlineCode':
					block.add((child as any).value).code;
					formats.forEach((format) => {
						if (format === 'bold') block.bold;
						else if (format === 'italic') block.italic;
					});
					break;
			}
		});
	}

	inner(block, paragraph, []);
	return block.text as string[][];
}
