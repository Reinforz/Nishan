import { Node } from 'unist';

import { NotionMarkdownConfig, TNotionBlocks } from '../src/types';
import {convertFrontMatter2Obj} from "../utils";

export async function mdast2NotionBlocks (mdast: Node) {
  let default_front_matter: NotionMarkdownConfig = {
    title: "Default Title"
  };

  let children: Node[] = (mdast as any).children;
  const contains_frontmatter = (mdast as any)?.children?.[0].type === "yaml", notion_blocks: TNotionBlocks[] = [];
  if(contains_frontmatter){
    default_front_matter = { ...default_front_matter, ...convertFrontMatter2Obj((mdast as any).children[0].value)}
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
    }
  })
  
  return {
    blocks: notion_blocks,
    config: default_front_matter
  };
}
