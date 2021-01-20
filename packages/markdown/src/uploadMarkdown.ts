import { ISpace } from '@nishans/types';
import { uploadToNotion, initializeNotion, mdast2NotionBlocks, parseFile } from '../utils';

interface UploadMarkdownParams {
	filepath: string;
	token: string;
	getSpace?: (space: ISpace) => any;
}

export async function uploadMarkdown ({ getSpace, filepath, token }: UploadMarkdownParams) {
	const tree = await parseFile(filepath);
	const { blocks, config } = await mdast2NotionBlocks(tree);
	const notion_data = await initializeNotion(token, getSpace);
	await uploadToNotion(notion_data, blocks, config);
}
