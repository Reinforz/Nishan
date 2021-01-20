import { IOperation, ISpace } from '@nishans/types';
import {
	uploadToNotion,
	initializeNotion,
	mdast2NotionBlocks,
	parseFile,
	generateNotionBlockOperations
} from '../utils';
import { NotionOperationData } from './types';

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

async function generateNotionBlockOperationsFromMarkdown (filepath: string, notion_data: NotionOperationData) {
	const { blocks, config } = await mdast2NotionBlocks(await parseFile(filepath));
	return await generateNotionBlockOperations(notion_data, blocks, config);
}

export async function uploadMarkdownFile ({ token, getSpace, filepath }: UploadMarkdownFileParams) {
	const notion_data = await initializeNotion(token, getSpace);
	const notion_block_ops = await generateNotionBlockOperationsFromMarkdown(filepath, notion_data);
	await uploadToNotion(notion_data, notion_block_ops);
}

export async function uploadMarkdownFiles ({ getSpace, filepaths, token }: UploadMarkdownFilesParams) {
	const operations: IOperation[] = [];
	const notion_data = await initializeNotion(token, getSpace);
	for (let index = 0; index < filepaths.length; index++)
		operations.push(...(await generateNotionBlockOperationsFromMarkdown(filepaths[index], notion_data)));

	await uploadToNotion(notion_data, operations);
}
