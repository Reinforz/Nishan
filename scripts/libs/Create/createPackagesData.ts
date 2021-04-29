import fs from 'fs';
import path from 'path';
import { IPackageInfo } from '../types';
import { createPackageMap } from './createPackageMap';

export async function createPackagesData () {
	const packages_data_json_path = path.resolve(__dirname, '../../../packages.json');
	const [package_map] = await createPackageMap();
	const packages_data: Pick<IPackageInfo, 'name' | 'description' | 'published'>[] = [];
	for (const [ , package_data ] of package_map) {
		packages_data.push({
			name: package_data.name,
			description: package_data.description,
			published: package_data.published
		});
	}

	await fs.promises.writeFile(packages_data_json_path, JSON.stringify(packages_data, null, 2), 'utf-8');
}
