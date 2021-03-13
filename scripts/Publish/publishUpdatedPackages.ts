import { updatePatchVersion } from '../Modify/updatePatchVersion';
import { createPackageMap } from './createPackageMap';
import { getUpdatedPackages } from './getUpdatedPackages';
import { rearrangePackageOrder } from './rearrangePackageOrder';
import { testAndBuildPackages } from './testAndBuildPackages';

export async function publishUpdatedPackages (updated_packages_name: string) {
	const packages_map = await createPackageMap();
	const updated_packages_map = getUpdatedPackages(updated_packages_name, packages_map);
	const rearranged_packages_map = rearrangePackageOrder(updated_packages_map, packages_map);
	updatePatchVersion(rearranged_packages_map);
	// updatePackageJsonDependencies(updated_packages_map);
	testAndBuildPackages(Array.from(rearranged_packages_map.keys()));
}

publishUpdatedPackages('core');
