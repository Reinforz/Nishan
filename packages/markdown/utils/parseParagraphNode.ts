import { TFormatBlockColor } from '@nishans/types';
import { Node } from 'unist';
import { inlineText, chunk } from './inlineBlock';

type TTextFormatter = ('b' | 'i' | '_' | 's' | 'c')
type TTextFormatters = TTextFormatter[];

function formatText (formats: TTextFormatters, block: chunk) {
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
      case 'c':
        block.code
        break;
		}
	});
}

export function parseTextFormatters(text: string, formats: TTextFormatters, block: chunk){
  const matches = (text as string).match(/(\[(?:(?:\w+=\w+),?)+\]{(\w?\s?)+})|(\w?\s?)+/g);
  matches?.forEach(match=>{
    const contains_format = match.match(/^\[((?:\w+=\w+,?)+)\]{((?:\w?\s?)+)}/);
    if(contains_format) {
      const [, formats_str, text] = contains_format;
      block.add(text);
      formats_str.split(",").forEach(format_str=>{
        const [format_target, format_value] = format_str.split("=");
        switch(format_target){
          case "c":
            block.highlight(format_value as TFormatBlockColor)
            break;
          case "bg":
            block.highlight(format_value as TFormatBlockColor)
            break;
          case "f":
            formats.push(...format_value.split("") as TTextFormatters)
            break;
        }
      })
      formatText(Array.from(new Set(formats)), block)
    }else{
      block.add(match);
      formatText(formats, block);
    }
  })
}

export function parseParagraphNode (paragraph: Node): string[][] {
	const block = inlineText();
	function inner (block: chunk, parent: Node, formats: TTextFormatters) {
		(parent as any).children.forEach((child: Node) => {
			switch (child.type) {
				case 'text':
          parseTextFormatters(child.value as string, formats, block)
					break;
				case 'emphasis':
					inner(block, child as any, formats.concat('i'));
					break;
				case 'strong':
					inner(block, child as any, formats.concat('b'));
					break;
				case 'inlineCode':
          parseTextFormatters(child.value as string, formats.concat('c'), block)
					break;
			}
		});
	}

	inner(block, paragraph, []);
	return block.text as string[][];
}
