import colors from 'colors';
import fs from 'fs';
import { NishanScripts } from '../';

export async function updatePackageDependency (packages_deps_version_map: Map<string, string>, package_name: string) {
	const { package_json_data, package_json_path } = await NishanScripts.Get.packageJsonData(package_name);
	const package_version = packages_deps_version_map.get(package_name);
	if (package_version) package_json_data.version = package_version;
  
	[ 'dependencies', 'devDependencies' ].forEach((dependency_type) => {
		Object.keys(package_json_data[dependency_type] ?? {}).forEach((dependency_name) => {
			const packages_deps_version = packages_deps_version_map.get(dependency_name)!;
			if (packages_deps_version) {
        package_json_data[dependency_type][dependency_name] = packages_deps_version;
        console.log(colors.bold.blue(`${dependency_type} ${dependency_name} ${packages_deps_version}`));
      }
		});
	});

	await fs.promises.writeFile(package_json_path, JSON.stringify(package_json_data, null, 2), 'utf-8');
}
