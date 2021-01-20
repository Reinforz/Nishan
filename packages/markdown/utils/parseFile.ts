import unified from 'unified';
import markdown from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import fs from 'fs';

const processor = unified().use(markdown).use(frontmatter, [ 'yaml' ]);

export async function parseFile (path: string) {
	return parseContent(await fs.promises.readFile(path, 'utf-8'));
}

export function parseContent (content: string) {
	return processor.parse(content);
}
