export function convertFrontMatter2Obj (frontmatter: string) {
	const lines = frontmatter.split('\n');
	const obj: Record<string, any> = {};
	lines.forEach((line) => {
		const match = line.match(/(?:(\w+):\s(.+))/);
		if (match) {
			const [ , key, value ] = match;
			obj[key] = value;
		}
	});
	return obj;
}
