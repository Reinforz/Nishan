import { NishanScripts } from '../';

export const getPackageNonInstalledDependencies = async (package_name: string) => {
	const package_imported_dependency_map = await NishanScripts.Extract.packageInstalledDependencies(package_name);
	const package_json_dependencies = await NishanScripts.Get.packageJsonDependencies(package_name);
	const package_non_installed_dependency_map: Map<string, string[]> = new Map();
	for (const [ package_imported_dependency, module_names ] of package_imported_dependency_map) {
		const package_imported_dependency_path = package_imported_dependency.split('/');
		let updated_package_imported_dependency = package_imported_dependency;
		if (package_imported_dependency_path.length >= 2)
			updated_package_imported_dependency = `${package_imported_dependency_path[0]}/${package_imported_dependency_path[1]}`;
		if (
			!updated_package_imported_dependency.match(/(fs|path|child_process)/) &&
			!package_json_dependencies[updated_package_imported_dependency]
		)
			package_non_installed_dependency_map.set(updated_package_imported_dependency, module_names);
	}
	return package_non_installed_dependency_map;
};
