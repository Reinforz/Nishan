import { Node } from 'unist';
import {convertFrontMatter2Obj} from "../utils";

export async function mdast2NotionBlocks (mdast: Node) {
  const contains_frontmatter = (mdast as any)?.children?.[0].type === "yaml";
  if(contains_frontmatter){
    const frontmatter_obj = convertFrontMatter2Obj((mdast as any).children[0].value)
    console.log(frontmatter_obj);
  }
  return '';
}
