import { NishanScripts } from '..';

export const getPackageNonInstalledDependencies = async (package_name: string) => {
	const package_imported_dependency_map = await NishanScripts.Extract.packageInstalledDependencies(package_name);
	const package_json_dependencies = await NishanScripts.Get.packageJsonDependencies(package_name);
	const package_non_installed_dependencies: string[] = [];
	for (const [ package_imported_dependency ] of package_imported_dependency_map) {
		if (!package_json_dependencies[package_imported_dependency])
			package_non_installed_dependencies.push(package_imported_dependency);
	}
	return package_non_installed_dependencies;
};
