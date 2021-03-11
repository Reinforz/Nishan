import colors from 'colors';
import fs from 'fs';
import path from 'path';
import remark from 'remark';
import packages_data from './packages.json';
import { createReadme, updatePackageJson } from './utils';

async function main () {
	const packages_dir = path.resolve(__dirname, '../../packages');
	const root_readme_path = path.resolve(__dirname, '../../README.md'),
		root_readme_text = await fs.promises.readFile(root_readme_path, 'utf-8'),
		parsed_root_readme_md: any = remark().parse(root_readme_text);

	let packages_readme_text = ``;

	for (let index = 0; index < packages_data.length; index++) {
		const package_data = packages_data[index],
			package_dir = path.join(packages_dir, package_data.name),
			package_readme_path = path.join(package_dir, 'README.md'),
			package_json_path = path.join(package_dir, 'package.json');
		await createReadme(package_readme_path, package_data.name, package_data.description);
		await updatePackageJson(package_json_path, package_data.description);
		packages_readme_text += `* **\`@nishans/${package_data.name}\`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/${package_data.name}) [NPM](https://www.npmjs.com/package/@nishans/${package_data.name}) [Docs](https://nishan-docs.netlify.app/docs/${package_data.name}): ${package_data.description}\n`;
		console.log(colors.bold.green(`Done with ${package_data.name}`));
	}

	const packages_readme_node = remark().parse(packages_readme_text);
	parsed_root_readme_md.children[10] = packages_readme_node;
	await fs.promises.writeFile(root_readme_path, remark().stringify(parsed_root_readme_md), 'utf-8');
}

main();
