import { Node } from 'unist';
import { inlineText, InlineTextFormatter } from '@nishans/utils';
import { InlineFormat, TFormatBlockColor, TTextFormat } from '@nishans/types';

function formatText (formats: InlineFormat[], block: InlineTextFormatter) {
	formats.forEach((format) => {
		switch (format[0]) {
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

export function parseTextFormatters(text: string, formats: InlineFormat[], block: InlineTextFormatter){
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
            formats.push(...format_value.split("").map((format)=>[format] as InlineFormat))
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

export function parseParagraphNode (paragraph: Node) {
	const block = inlineText();
	function inner (block: InlineTextFormatter, parent: Node, formats: InlineFormat[]) {
		(parent as any).children.forEach((child: Node) => {
			switch (child.type) {
				case 'text':
          parseTextFormatters(child.value as string, formats, block)
					break;
				case 'emphasis':
					inner(block, child as any, formats.concat(['i']));
					break;
				case 'strong':
					inner(block, child as any, formats.concat(['b']));
					break;
				case 'inlineCode':
          parseTextFormatters(child.value as string, formats.concat(['c']), block)
					break;
			}
		});
	}

	inner(block, paragraph, []);
	return block.text;
}
