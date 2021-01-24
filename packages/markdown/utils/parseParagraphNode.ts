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

export function parseTextFormatters(text: string, block: InlineTextFormatter){
  const formats: InlineFormat[] = [];
  const matches = text.matchAll(/(?:\[(?<spe_format>(?:(?:\w+=\w+),?)+)\](?<spe_content>".+?"))|(?<reg_content>".+?")+/g);
  if(matches){
    for (const match of matches) {
      if(match.groups?.spe_content)
        block.add(match.groups?.spe_content?.replace(/\"/g, ''))
      if(match.groups?.spe_format){
        match.groups?.spe_format.split(",").forEach(format_str=>{
          const [format_target, format_value] = format_str.split("=");
          switch(format_target){
            case "c":
              block.highlight(format_value as TFormatBlockColor)
              break;
            case "bg":
              block.highlight(format_value+"_background" as TFormatBlockColor)
              break;
            case "f":
              formats.push(...format_value.split("").map((format)=>[format] as InlineFormat))
              break;
          }
        })
      }
      if(match.groups?.reg_content) 
        block.add(match.groups?.reg_content?.replace(/\"/g, ''))

      formatText(Array.from(new Set(formats)), block)
      block.add(" ")
    }
  }else
    throw new Error("Special formatted texts, must follow the rules")
}

export function parseText(text: string, formats: InlineFormat[], block: InlineTextFormatter){
  const special_text = text.match(/^::\s(.*)/);
  if(special_text)
    parseTextFormatters(text, block)
  else{
    block.add(text);
    formatText(formats, block);
  }
}

export function parseParagraphNode (paragraph: Node) {
	const block = inlineText();
	function inner (block: InlineTextFormatter, parent: Node, formats: InlineFormat[]) {
		(parent as any).children.forEach((child: Node) => {
			switch (child.type) {
				case 'text':
          parseText(child.value as string, formats, block)
					break;
				case 'emphasis':
					inner(block, child as any, formats.concat(['i']));
					break;
				case 'strong':
					inner(block, child as any, formats.concat(['b']));
					break;
				case 'inlineCode':
          block.add(child.value as string);
          formatText(formats.concat(['c']), block);
					break;
			}
		});
	}

	inner(block, paragraph, []);
	return block.text;
}
