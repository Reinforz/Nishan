import { Node } from 'unist';

import { FrontMatterKeys, TNotionBlocks } from '../src/types';
import {convertFrontMatter2Obj} from "../utils";

let default_front_matter: Record<FrontMatterKeys, any> = {
  title: "Default Title"
}

export async function mdast2NotionBlocks (mdast: Node) {
  let children: Node[] = (mdast as any).children;
  const contains_frontmatter = (mdast as any)?.children?.[0].type === "yaml", notion_blocks: TNotionBlocks[] = [];
  if(contains_frontmatter){
    default_front_matter = { ...default_front_matter, ...convertFrontMatter2Obj((mdast as any).children[0].value)}
    children = children.slice(1)
  }

  // console.log(JSON.stringify(children, null, 2));
  
  children.forEach(child=>{
    switch(child.type){
      case "heading":
        notion_blocks.push({
          type: "header",
          title: ((child as any).children[0] as Node).value as string
        })
    }
  })
  
  return notion_blocks;
}
