import { v4 } from 'uuid';
import { parseNodes, parseParagraphNode, TNotionBlocks } from '../src';
import { ASTNode } from '../src';

export function parseListNode (node: ASTNode) {
	const notion_blocks: TNotionBlocks[] = [],
		type = (node as any).ordered === true ? 'numbered_list' : 'bulleted_list',
		list_id = v4();
	notion_blocks.push({
		type,
		id: list_id,
		title: parseParagraphNode(node.children[0].children[0])
	});

	// Since the first child would be the text content of the list item
	node.children.forEach((child) => child.children.slice(1).forEach((child) => parseNodes(child, notion_blocks)));
	return notion_blocks;
}
