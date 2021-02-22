import { inlineText, InlineTextFormatter } from '@nishans/inline-blocks';
import { InlineFormat } from '@nishans/types';
import { ASTNode } from 'src';

export function parseTextFormatterString(formats_str: string){
  const formats: InlineFormat[] = [];
  formats_str && formats_str.split(",").forEach(format_str=>{
    const [format_target, format_value] = format_str.split("=");
    switch(format_target){
      case "c":
        formats.push(['h', format_value as any])
        break;
      case "bg":
        formats.push(['h', format_value+"_background" as any])
        break;
      case "f":
        formats.push(...format_value.split("").map((format)=>[format] as InlineFormat))
        break;
    }
  })
  return formats;
}

export function parseSpecialText(text: string, global_formats: InlineFormat[], block: InlineTextFormatter){
  const matches = text.matchAll(/(?:\[(?<spe_format>(?:(?:\w+=\w+),?)+)\](?<spe_content>".+?"))|(?<reg_content>".+?")+/g);
  if(matches){
    for (const match of matches) {
      const local_formats: InlineFormat[] = [];
      if(match.groups?.spe_content)
        block.add(match.groups?.spe_content?.replace(/\"/g, ''))
      if(match.groups?.spe_format)
        local_formats.push(...parseTextFormatterString(match.groups?.spe_format))
      if(match.groups?.reg_content) 
        block.add(match.groups?.reg_content?.replace(/\"/g, ''))
      Array.from(new Set([...local_formats, ...global_formats])).forEach((format) => {
        block.pushToLast(format);
      })
      block.add(" ")
      global_formats.forEach((format) => {
        block.pushToLast(format);
      })
    }
  }else
    throw new Error("Special formatted texts must follow the rules")
}

export function parseText(text: string, formats: InlineFormat[], block: InlineTextFormatter){
  const special_text = text.match(/^::(?:\[(?<global_format>(?:(?:\w+=\w+),?)+)\])?\s?(?<content>.+)/);
  if(special_text)
    parseSpecialText(text, parseTextFormatterString(special_text.groups?.global_format as string), block)
  else{
    block.add(text);
    formats.forEach((format) => {
      block.pushToLast(format);
    })
  }
}

export function parseParagraphNode (paragraph: ASTNode) {
	const block = inlineText();
	function inner (block: InlineTextFormatter, parent: ASTNode, formats: InlineFormat[]) {
		parent.children.forEach((child) => {
			switch (child.type) {
				case 'text':
          parseText(child.value as string, formats, block)
					break;
				case 'emphasis':
					inner(block, child, formats.concat(['i']));
					break;
				case 'strong':
					inner(block, child, formats.concat(['b']));
          break;
        case 'delete':
          inner(block, child, formats.concat(['s']));
          break;
        case 'underline':
          inner(block, child, formats.concat(['_']));
          break;
				case 'inlineCode':
          block.add(child.value as string);
          block.pushToLast(['c'])
					break;
			}
		});
	}

	inner(block, paragraph, []);
	return block.text;
}
