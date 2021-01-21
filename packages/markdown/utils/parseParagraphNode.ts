import { TFormatBlockColor } from '@nishans/types';
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
          const {value: text} = child, matches = (text as string).match(/(\[(?:\w+=\w+)\]{(?:\w?\s?)+})|(\w?\s?)+/g);
          matches?.forEach(match=>{
            const contains_format = match.match(/^\[(\w+=\w+)\]{((?:\w?\s?)+)}/);
            if(contains_format) {
              const [, format, text] = contains_format, [highlight, color] = format.split("=");
              block.add(text);
              block.highlight((highlight === "c" ? color : color+"_background") as TFormatBlockColor)
              formatText(formats, block)
            }else{
              block.add(match);
              formatText(formats, block);
            }
          })
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
