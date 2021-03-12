import { createPackageMap } from './createPackageMap';
import { getUpdatedPackages } from './getUpdatedPackages';
import { updatePatchVersion } from './updatePatchVersion';

export async function publishUpdatedPackages (updated_packages_name: string) {
	const packages_map = await createPackageMap();
	const updated_package_map = getUpdatedPackages(updated_packages_name, packages_map);
	updatePatchVersion(updated_package_map);
	console.log(updated_package_map);
}

publishUpdatedPackages('core');
