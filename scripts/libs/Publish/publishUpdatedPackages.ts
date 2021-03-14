import { buildAfterTest } from '../Build/buildAfterTest';
import { createDependencyMap } from '../Create/createDependencyMap';
import { createOrderedPackage } from '../Create/createOrderedPackage';
import { createPackageMap } from '../Create/createPackageMap';
import { updatePackageJsonDependencies } from '../Update/updatePackageJsonDependencies';
import { updatePatchVersion } from '../Update/updatePatchVersion';
import { publishPackages } from './publishPackages';

export async function publishUpdatedPackages (updated_packages_name: string[]) {
	const packages_map = await createPackageMap(),
		package_dependency_map = createDependencyMap(updated_packages_name, packages_map),
		rearranged_packages_map = createOrderedPackage(package_dependency_map.all, packages_map),
		rearranged_packages = Array.from(rearranged_packages_map.keys());
	updatePatchVersion(rearranged_packages_map);
	await updatePackageJsonDependencies(rearranged_packages_map);
	const package_dirs = buildAfterTest(rearranged_packages);
	publishPackages(package_dirs);
}
