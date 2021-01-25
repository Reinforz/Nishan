import { parseListNode, parseParagraphNode, TNotionBlocks } from '../src';
import { Node } from 'unist';
import { TCodeLanguage } from '@nishans/types';

export function parseNodes (node: Node, notion_blocks: TNotionBlocks[]) {
	switch (node.type) {
		case 'heading':
			const { depth, children: [ { value: title } ] } = node as any;
			if (depth === 1)
				notion_blocks.push({
					type: 'header',
					title: [ [ title ] ]
				});
			else if (depth === 2)
				notion_blocks.push({
					type: 'sub_header',
					title: [ [ title ] ]
				});
			else
				notion_blocks.push({
					type: 'sub_sub_header',
					title: [ [ title ] ]
				});
			break;
		case 'paragraph':
			notion_blocks.push({
				type: 'text',
				title: parseParagraphNode(node)
			});
			break;
		case 'code':
			notion_blocks.push({
				type: 'code',
				title: [ [ node.value as string ] ],
				lang: node.lang as TCodeLanguage
			});
			break;
		case 'blockquote':
			notion_blocks.push({
				type: 'quote',
				title: parseParagraphNode((node as any).children[0])
			});
			break;
		case 'list':
			notion_blocks.push(...parseListNode(node));
			break;
		case 'thematicBreak':
			notion_blocks.push({
				type: 'divider'
			});
			break;
	}
}
