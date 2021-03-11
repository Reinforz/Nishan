import path from 'path';
import packages_data from './packages.json';
import { createReadme, updatePackageJson } from './utils';

async function main () {
	const packages_dir = path.resolve(__dirname, '../../packages');

	for (let index = 0; index < 1; index++) {
		const package_data = packages_data[index],
			package_dir = path.join(packages_dir, package_data.name),
			package_readme_path = path.join(package_dir, 'README.md'),
			package_json_path = path.join(package_dir, 'package.json');
		await createReadme(package_readme_path, package_data.name, package_data.description);
		await updatePackageJson(package_json_path, package_data.description);
	}
}

main();
