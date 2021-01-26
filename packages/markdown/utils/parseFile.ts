import unified from 'unified';
import markdown from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import fs from 'fs';
import gfm from 'remark-gfm';
import notion from '@nishans/remark-notion';

const processor = unified().use(markdown).use(frontmatter, [ 'yaml' ]).use(notion);

export async function parseFile (path: string) {
	return parseContent(await fs.promises.readFile(path, 'utf-8'));
}

export function parseContent (content: string) {
	return processor.parse(content);
}
