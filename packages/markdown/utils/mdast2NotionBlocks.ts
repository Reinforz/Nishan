import { TCodeLanguage } from '@nishans/types';
import { Node } from 'unist';

import { NotionMarkdownConfig, TNotionBlocks } from '../src/types';
import {parseParagraphNode, convertFrontMatter2Obj, parseListNode, parseNodes} from "../utils";

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

  children.forEach(child=>parseNodes(child, notion_blocks));
  
  return {
    blocks: notion_blocks,
    config: default_config
  };
}
