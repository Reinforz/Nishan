import unified from 'unified';
import markdown from 'remark-parse';
import fs from 'fs';

const processor = unified().use(markdown);

export async function parseFile (path: string) {
	const content = await fs.promises.readFile(path, 'utf-8');
	return processor.parse(content);
}
