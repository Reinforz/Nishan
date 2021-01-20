import { IOperation, ISpace } from '@nishans/types';
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

interface UploadMarkdownFilesParams {
	filepaths: string[];
	token: UploadMarkdownFileParams['token'];
	getSpace?: UploadMarkdownFileParams['getSpace'];
}

export async function uploadMarkdownFile ({ getSpace, filepath, token }: UploadMarkdownFileParams) {
	const tree = await parseFile(filepath);
	const notion_data = await initializeNotion(token, getSpace);
	const { blocks, config } = await mdast2NotionBlocks(tree);
	const notion_block_ops = await generateNotionBlockOperations(notion_data, blocks, config);
	await uploadToNotion(notion_data, notion_block_ops);
}

export async function uploadMarkdownFiles ({ getSpace, filepaths, token }: UploadMarkdownFilesParams) {
	const operations: IOperation[] = [];
	const notion_data = await initializeNotion(token, getSpace);
	for (let index = 0; index < filepaths.length; index++) {
		const filepath = filepaths[index];
		const tree = await parseFile(filepath);
		const { blocks, config } = await mdast2NotionBlocks(tree);
		operations.push(...(await generateNotionBlockOperations(notion_data, blocks, config)));
	}
	await uploadToNotion(notion_data, operations);
}
