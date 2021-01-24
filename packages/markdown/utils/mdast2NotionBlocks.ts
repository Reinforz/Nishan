import { TCodeLanguage } from '@nishans/types';
import { Node } from 'unist';

import { NotionMarkdownConfig, TNotionBlocks } from '../src/types';
import {parseParagraphNode, convertFrontMatter2Obj} from "../utils";

export async function mdast2NotionBlocks (mdast: Node) {
  let default_config: NotionMarkdownConfig = {
    title: "Default Title"
  };

  let children: Node[] = (mdast as any).children;
  const contains_frontmatter = (mdast as any)?.children?.[0].type === "yaml", notion_blocks: TNotionBlocks[] = [];
  if(contains_frontmatter){
    default_config = { ...default_config, ...convertFrontMatter2Obj((mdast as any).children[0].value)}
    children = children.slice(1)
  }

  children.forEach(child=>{
    switch(child.type){
      case "heading":
        const {depth, children: [{value: title}]} = child as any;
        if(depth === 1)
          notion_blocks.push({
            type: "header",
            title: [[title]]
          })
        else if(depth === 2)
          notion_blocks.push({
            type: "sub_header",
            title: [[title]]
          })
        else
        notion_blocks.push({
          type: "sub_sub_header",
          title: [[title]]
        })
        break;
      case 'paragraph':
        notion_blocks.push({
          type: "text",
          title: parseParagraphNode(child)
        })
        break;
      case "code":
        notion_blocks.push({
          type: "code",
          title: [[child.value as string]],
          lang: child.lang as TCodeLanguage
        })
        break
      case "blockquote":
        notion_blocks.push({
          type: "quote",
          title: parseParagraphNode((child as any).children[0])
        })
        break;
      case "list":
        const type = child.orderd === true ? "numbered_list" : "bulleted_list"; 
        (child as any).children.forEach((child: any)=>{
          notion_blocks.push({
            type,
            title: [[child.children[0].children[0].value]]
          })
        })
        break;
      case "thematicBreak":
        notion_blocks.push({
          type: "divider"
        })
        break
    }
  })
  
  return {
    blocks: notion_blocks,
    config: default_config
  };
}
