import { updatePatchVersion } from '../Modify/updatePatchVersion';
import { createPackageMap } from './createPackageMap';
import { getUpdatedPackages } from './getUpdatedPackages';
import { publishPackages } from './publishPackages';

export async function publishUpdatedPackages (updated_packages_name: string) {
	const packages_map = await createPackageMap();
	const updated_packages_map = getUpdatedPackages(updated_packages_name, packages_map);
	updatePatchVersion(updated_packages_map);
	// updatePackageJsonDependencies(updated_packages_map);
	publishPackages(Array.from(updated_packages_map.keys()));
}

publishUpdatedPackages('core');
