import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { buildAfterTest } from '../Build/buildAfterTest';
import { createDependencyMap } from '../Create/createDependencyMap';
import { createPackageMap } from '../Create/createPackageMap';
import { createPackagePublishOrder } from '../Create/createPackagePublishOrder';
import { updatePatchVersion } from '../Update/updatePatchVersion';
import { publishPackages } from './publishPackages';

export async function publishUpdatedPackages (updated_packages_name: string[] | true) {
	const packages_map = await createPackageMap();
	let rearranged_packages: string[] = [];
	if (Array.isArray(updated_packages_name)) {
		const package_dependency_map = createDependencyMap(updated_packages_name, packages_map);
		rearranged_packages = createPackagePublishOrder(Array.from(package_dependency_map.all.keys()), packages_map);
	} else
		rearranged_packages = JSON.parse(
			await fs.promises.readFile(path.resolve(__dirname, '../../../data/non_builded_packages.json'), 'utf-8')
		);

	console.log(`Building ${rearranged_packages.length} packages`);
	console.log(colors.blue.bold(rearranged_packages.join('\n')));

	const updated_packages_map = updatePatchVersion(rearranged_packages, packages_map, 1);
	await buildAfterTest(rearranged_packages);
	await publishPackages(updated_packages_map);
}
