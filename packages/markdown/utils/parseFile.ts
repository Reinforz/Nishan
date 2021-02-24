import notion from '@nishans/remark-notion';
import fs from 'fs';
import frontmatter from 'remark-frontmatter';
import markdown from 'remark-parse';
import unified from 'unified';

const processor = unified().use(markdown).use(frontmatter, [ 'yaml' ]).use(notion);

export async function parseFile (path: string) {
	return parseContent(await fs.promises.readFile(path, 'utf-8'));
}

export function parseContent (content: string) {
	return processor.parse(content);
}
