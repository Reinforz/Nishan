import { updatePackageJsonDependencies } from '../Modify/updatePackageJsonDependencies';
import { updatePatchVersion } from '../Modify/updatePatchVersion';
import { createPackageMap } from './createPackageMap';
import { getUpdatedPackages } from './getUpdatedPackages';

export async function publishUpdatedPackages (updated_packages_name: string) {
	const packages_map = await createPackageMap();
	const updated_packages_map = getUpdatedPackages(updated_packages_name, packages_map);
	updatePatchVersion(updated_packages_map);
	updatePackageJsonDependencies(updated_packages_map);
}

publishUpdatedPackages('core');
