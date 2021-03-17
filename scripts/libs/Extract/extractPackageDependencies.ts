import colors from 'colors';
import glob from 'glob';
import path from 'path';
import { extractModuleDependencies } from './extractModuleDependencies';

export const extractPackageDependencies = async (package_name: string): Promise<Map<string, string[]>> => {
	const imported_package_dependencies_map: Map<string, string[]> = new Map();
	const package_src_dir = path.resolve(__dirname, `../../../../packages/${package_name}/libs`);
	return new Promise((resolve) => {
		glob(`${package_src_dir}/**/*.ts`, {}, (_, files) => {
			files.forEach((file) => {
				const imported_module_dependencies = extractModuleDependencies(file);
				const dir_name = path.relative(package_src_dir, file);
				imported_module_dependencies.forEach((imported_module_dependency) => {
					const imported_package_dependency_map = imported_package_dependencies_map.get(imported_module_dependency);
					if (imported_package_dependency_map) imported_package_dependency_map.push(dir_name);
					else imported_package_dependencies_map.set(imported_module_dependency, [ dir_name ]);
				});
				console.log(colors.green.bold(`Extracted module ${dir_name}`));
			});
			resolve(imported_package_dependencies_map);
		});
	});
};
