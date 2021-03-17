import { NishanScripts } from '..';

export const getPackageNonInstalledDependencies = async (package_name: string) => {
	const package_imported_dependency_map = await NishanScripts.Extract.packageInstalledDependencies(package_name);
	const package_json_dependencies = await NishanScripts.Get.packageJsonDependencies(package_name);
	const package_non_installed_dependency_map: Map<string, string[]> = new Map();
	for (const [ package_imported_dependency, module_names ] of package_imported_dependency_map) {
		if (!package_json_dependencies[package_imported_dependency])
			package_non_installed_dependency_map.set(package_imported_dependency, module_names);
	}
	return package_non_installed_dependency_map;
};
