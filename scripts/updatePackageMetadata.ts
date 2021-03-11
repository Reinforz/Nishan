import path from 'path';
import packages_data from './packages.json';

async function main () {
	const packages_dir = path.resolve(__dirname, '../../packages');

	for (let index = 0; index < packages_data.length; index++) {
		const package_data = packages_data[index],
			package_dir = path.join(packages_dir, package_data.name),
			package_readme_path = path.join(package_dir, 'README.md');
		console.log(package_readme_path);
	}
}

main();
