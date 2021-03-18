import fs from 'fs';
import path from 'path';

export const getPackageJsonData = async (package_name: string) => {
	const packages_dir = path.resolve(__dirname, '../../../../packages');
	const package_dir = path.join(packages_dir, package_name.split('/')[1]),
		package_package_json_path = path.join(package_dir, 'package.json');

	return {
		package_json_data: JSON.parse(await fs.promises.readFile(package_package_json_path, 'utf-8')),
		package_json_path: package_package_json_path
	};
};
