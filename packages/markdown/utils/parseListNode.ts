import { v4 } from 'uuid';
import { parseNodes, ParseNodesParentData, parseParagraphNode, TNotionBlocks } from '../src';
import { ASTNode } from '../src';

export function parseListNode (node: ASTNode, parent_data?: ParseNodesParentData) {
	const notion_blocks: TNotionBlocks[] = [],
    type = (node as any).ordered === true ? 'numbered_list' : 'bulleted_list';

	node.children.forEach((child) =>{
    const list_id = v4(),
		child_ids: string[] = [];
    notion_blocks.push({
      type,
      id: list_id,
      title: parseParagraphNode(node.children[0].children[0]),
      child_ids,
      parent_id: parent_data?.parent_id
    });
    
    if (parent_data?.child_container) parent_data.child_container.push(list_id);
	  // Since the first child would be the text content of the list item
		child.children
			.slice(1)
			.forEach((child) => parseNodes(child, notion_blocks, { parent_id: list_id, child_container: child_ids }))
  });
	return notion_blocks;
}
