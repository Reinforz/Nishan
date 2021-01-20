import { ISpace } from '@nishans/types';
import {
	uploadToNotion,
	initializeNotion,
	mdast2NotionBlocks,
	parseFile,
	generateNotionBlockOperations
} from '../utils';

interface UploadMarkdownFileParams {
	filepath: string;
	token: string;
	getSpace?: (space: ISpace) => any;
}

export async function uploadMarkdownFile ({ getSpace, filepath, token }: UploadMarkdownFileParams) {
	const tree = await parseFile(filepath);
	const notion_data = await initializeNotion(token, getSpace);
	const { blocks, config } = await mdast2NotionBlocks(tree);
	const notion_block_ops = await generateNotionBlockOperations(notion_data, blocks, config);
	await uploadToNotion(notion_data, notion_block_ops);
}
