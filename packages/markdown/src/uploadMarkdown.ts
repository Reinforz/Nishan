import { mdast2NotionBlocks, parseFile } from '../utils';

interface UploadMarkdownParams {
	filepath: string;
	token: string;
}

export async function uploadMarkdown ({ filepath, token }: UploadMarkdownParams) {
	const tree = await parseFile(filepath);
	const notion_ast = await mdast2NotionBlocks(tree);
	console.log(notion_ast);
}
