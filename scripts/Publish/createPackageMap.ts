import fs from 'fs';
import path from 'path';
import { IPackageMap } from "../types";
import { trimDependencies } from './trimDependencies';

export async function createPackageMap(){
  const packages_dir = path.resolve(__dirname, '../../../packages'),
		package_dirs = await fs.promises.readdir(packages_dir), packages_map: IPackageMap = new Map();

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

  Array.from(packages_map.entries()).forEach(([ package_name, package_info ])=>{
    const dependencies = Object.keys(package_info.dependencies);
		dependencies.forEach((dependency) => {
			const package_map = packages_map.get(dependency);
			if (package_map) package_map.dependents[package_name] = package_info.version;
		});
  });

  return packages_map;
}