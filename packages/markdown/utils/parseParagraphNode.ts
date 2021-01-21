import { Node } from 'unist';
import { inlineText, chunk } from './inlineBlock';

function formatText (formats: ('b' | 'i' | '_' | 's')[], block: chunk) {
	formats.forEach((format) => {
		switch (format) {
			case 's':
				block.strikeThrough;
				break;
			case '_':
				block.underline;
				break;
			case 'i':
				block.italic;
				break;
			case 'b':
				block.bold;
				break;
		}
	});
}

export function parseParagraphNode (paragraph: Node): string[][] {
	const block = inlineText();

	function inner (block: chunk, parent: Node, formats: ('b' | 'i' | '_' | 's')[]) {
		(parent as any).children.forEach((child: Node) => {
			switch (child.type) {
				case 'text':
					block.add((child as any).value);
					formatText(formats, block);
					break;
				case 'emphasis':
					inner(block, child as any, formats.concat('i'));
					break;
				case 'strong':
					inner(block, child as any, formats.concat('b'));
					break;
				case 'inlineCode':
					block.add((child as any).value).code;
					formatText(formats, block);
					break;
			}
		});
	}

	inner(block, paragraph, []);
	return block.text as string[][];
}
