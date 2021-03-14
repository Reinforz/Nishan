import { createDependencyMap } from '../Create/createDependencyMap';
import { createPackageMap } from '../Create/createPackageMap';
import { updatePackageJsonDependencies } from '../Modify/updatePackageJsonDependencies';
import { updatePatchVersion } from '../Modify/updatePatchVersion';
import { publishPackages } from './publishPackages';
import { rearrangePackageOrder } from './rearrangePackageOrder';
import { testAndBuildPackages } from './testAndBuildPackages';

export async function publishUpdatedPackages (updated_packages_name: string[]) {
	const packages_map = await createPackageMap(),
		package_dependency_map = createDependencyMap(updated_packages_name, packages_map),
		rearranged_packages_map = rearrangePackageOrder(package_dependency_map.all, packages_map),
		rearranged_packages = Array.from(rearranged_packages_map.keys());
	updatePatchVersion(rearranged_packages_map);
	await updatePackageJsonDependencies(rearranged_packages_map);
	const package_dirs = testAndBuildPackages(rearranged_packages);
	publishPackages(package_dirs);
}

publishUpdatedPackages([ 'inline-blocks' ]);
