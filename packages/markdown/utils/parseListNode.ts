import { TNotionBlocks } from '../src';
import { Node } from 'unist';

export function parseListNode (node: Node) {
	const notion_blocks: TNotionBlocks[] = [];

	function inner (node: Node) {
		const type = node.orderd === true ? 'numbered_list' : 'bulleted_list';

		(node as any).children.forEach((child: any) => {
			notion_blocks.push({
				type,
				title: [ [ child.children[0].children[0].value ] ]
			});
		});
	}

	inner(node);
	return notion_blocks;
}
