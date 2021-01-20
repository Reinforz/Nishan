import { IOperation, ISpace } from '@nishans/types';
import { Node } from 'unist';
import {
	uploadToNotion,
	initializeNotion,
	mdast2NotionBlocks,
	parseFile,
	generateNotionBlockOperations,
	parseContent
} from '../utils';
import { NotionOperationData } from './types';

type UploadMarkdownFileParams = ({ filepath: string } | { content: string }) & {
	token: string;
	getSpace?: (space: ISpace) => any;
};

type UploadMarkdownFilesParams = ({ filepaths: string[] } | { contents: string[] }) & {
	token: UploadMarkdownFileParams['token'];
	getSpace?: UploadMarkdownFileParams['getSpace'];
};

async function generateNotionBlockOperationsFromMarkdown (content: Node, notion_data: NotionOperationData) {
	const { blocks, config } = await mdast2NotionBlocks(content);
	return await generateNotionBlockOperations(notion_data, blocks, config);
}

export async function uploadMarkdownFile (params: UploadMarkdownFileParams) {
	const notion_data = await initializeNotion(params.token, params.getSpace);
	const notion_block_ops = await generateNotionBlockOperationsFromMarkdown(
		(params as any).filepath ? await parseFile((params as any).filepath) : parseContent((params as any).content),
		notion_data
	);
	await uploadToNotion(notion_data, notion_block_ops);
}

export async function uploadMarkdownFiles (params: UploadMarkdownFilesParams) {
	const operations: IOperation[] = [],
		array: string[] = (params as any).filepaths || (params as any).contents;
	const notion_data = await initializeNotion(params.token, params.getSpace);
	for (let index = 0; index < array.length; index++)
		operations.push(
			...(await generateNotionBlockOperationsFromMarkdown(
				(params as any).filepaths ? await parseFile(array[index]) : parseContent(array[index]),
				notion_data
			))
		);

	await uploadToNotion(notion_data, operations);
}
