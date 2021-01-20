import { ISpace } from '@nishans/types';
import { initializeNotion, mdast2NotionBlocks, parseFile } from '../utils';

interface UploadMarkdownParams {
	filepath: string;
	token: string;
	getSpace?: (space: ISpace) => any;
}

export async function uploadMarkdown ({ getSpace, filepath, token }: UploadMarkdownParams) {
	const tree = await parseFile(filepath);
	const notion_ast = await mdast2NotionBlocks(tree);
	initializeNotion(token, getSpace);
	console.log(notion_ast);
}
