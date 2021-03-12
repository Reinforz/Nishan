import fs from 'fs';
import path from 'path';
import { trimDependencies } from './utils';

export async function getUpdatedPackages () {
	const packages_dir = path.resolve(__dirname, '../../packages'),
		[ updated_packages_name ] = process.argv.slice(2),
		updated_package_names = updated_packages_name.split(','),
		package_dirs = await fs.promises.readdir(packages_dir),
		updated_package_map: Map<string, string> = new Map();

	const packages_map: Map<
		string,
		{ version: string; dependents: Record<string, string>; dependencies: Record<string, string>; name: string }
	> = new Map();

	for (const package_dir of package_dirs) {
		const package_package_json_data = JSON.parse(
			await fs.promises.readFile(path.join(packages_dir, package_dir, 'package.json'), 'utf-8')
		);
		packages_map.set(`@nishans/${package_dir}`, {
			dependencies: trimDependencies(package_package_json_data.dependencies ?? {}),
			version: package_package_json_data.version,
			dependents: {},
			name: `@nishans/${package_dir}`
		});
	}

	for (const [ package_name, package_info ] of packages_map.entries()) {
		const dependencies = Object.keys(package_info.dependencies);
		dependencies.forEach((dependency) => {
			const package_map = packages_map.get(dependency);
			if (package_map) package_map.dependents[package_name] = package_info.version;
		});
	}

	for (const updated_package_name of updated_package_names) {
		const package_map = packages_map.get(`@nishans/${updated_package_name}`);
		if (package_map) {
			updated_package_map.set(package_map.name, package_map.version);
			Object.entries(package_map.dependents).forEach(([ dependent_name, dependent_version ]) => {
				updated_package_map.set(dependent_name, dependent_version);
			});
		}
	}
}