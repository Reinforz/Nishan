import { NishanScripts } from '../';

export async function publishUpdatedPackages (updated_packages_name: string[]) {
	const packages_map = await NishanScripts.Create.packageMap(),
		package_dependency_map = NishanScripts.Create.dependencyMap(updated_packages_name, packages_map),
		rearranged_packages_map = NishanScripts.Create.orderedPackage(package_dependency_map.all, packages_map),
		rearranged_packages = Array.from(rearranged_packages_map.keys());
	NishanScripts.Update.patchVersion(rearranged_packages_map);
	await NishanScripts.Update.PackageJsonDependencies(rearranged_packages_map);
	const package_dirs = NishanScripts.Build.afterTest(rearranged_packages);
	NishanScripts.Publish.packages(package_dirs);
}

publishUpdatedPackages([ 'inline-blocks' ]);
