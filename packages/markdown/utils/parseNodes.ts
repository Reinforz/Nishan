import { CommonBlockInfo, ASTNode, parseListNode, parseParagraphNode, TNotionBlocks } from '../src';
import { TCodeLanguage } from '@nishans/types';
import { v4 } from 'uuid';

export interface ParseNodesParentData {
	parent_id?: string;
	child_container?: string[];
}

export function parseNodes (node: ASTNode, notion_blocks: TNotionBlocks[], parent_data?: ParseNodesParentData) {
	const block_id = v4();
	const common_info = {
    id: block_id,
    child_ids: []
  } as CommonBlockInfo;
  
  // List nodes populate child_container inside parseListNode util function
	if (node.type !=="list" && parent_data?.child_container) parent_data.child_container.push(block_id);
  if (parent_data?.parent_id) common_info.parent_id = parent_data.parent_id;
  
	switch (node.type) {
		case 'heading':
			const { depth, children: [ { value: title } ] } = node as any;
			if (depth === 1)
				notion_blocks.push({
					type: 'header',
					title: [ [ title ] ],
					...common_info
				});
			else if (depth === 2)
				notion_blocks.push({
					type: 'sub_header',
					title: [ [ title ] ],
					...common_info
				});
			else
				notion_blocks.push({
					type: 'sub_sub_header',
					title: [ [ title ] ],
					...common_info
				});
			break;
		case 'paragraph':
			notion_blocks.push({
				type: 'text',
				title: parseParagraphNode(node),
				...common_info
			});
			break;
		case 'code':
			notion_blocks.push({
				type: 'code',
				title: [ [ node.value as string ] ],
				lang: node.lang as TCodeLanguage,
				...common_info
			});
			break;
		case 'blockquote':
			notion_blocks.push({
				type: 'quote',
				title: parseParagraphNode((node as any).children[0]),
				...common_info
			});
			break;
		case 'list':
			notion_blocks.push(...parseListNode(node, parent_data));
			break;
		case 'thematicBreak':
			notion_blocks.push({
				type: 'divider',
				...common_info
			});
			break;
	}
}
