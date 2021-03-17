import { extractPackageDependencies } from './extractPackageDependencies';

export const extractPackageInstalledDependencies = async (package_name: string) => {
	const imported_package_dependencies_map = await extractPackageDependencies(package_name);
	const nishans_dependencies_map: Map<string, string[]> = new Map();
	for (const [ imported_module_dependency, module_names ] of imported_package_dependencies_map) {
		if (!imported_module_dependency.startsWith('.'))
			nishans_dependencies_map.set(imported_module_dependency, module_names);
	}
	return nishans_dependencies_map;
};
