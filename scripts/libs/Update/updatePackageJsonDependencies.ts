import colors from 'colors';
import fs from 'fs';
import path from 'path';

export async function updatePackageJsonDependencies (updated_packages_map: Map<string, string>) {
	const packages_dir = path.resolve(__dirname, '../../../../packages');
	for (const [ package_name, package_version ] of Array.from(updated_packages_map.entries())) {
		console.log(colors.white.bold(package_name));
		console.log(colors.yellow.bold(`Updating ${package_name} to ${package_version}`));

		const package_dir = path.join(packages_dir, package_name.split('/')[1]),
			package_package_json_path = path.join(package_dir, 'package.json'),
			package_package_json_data = JSON.parse(await fs.promises.readFile(package_package_json_path, 'utf-8'));

		package_package_json_data.version = package_version;

		for (const [ updated_package_name, updated_package_version ] of Array.from(updated_packages_map.entries())) {
			[ 'dependencies', 'devDependencies' ].forEach((dependency_type) => {
				if (package_package_json_data[dependency_type]?.[updated_package_name]) {
					console.log(
						`DEP ${colors.blue.bold(updated_package_name)} : ${colors.red.bold(
							package_package_json_data[dependency_type][updated_package_name]
						)} => ${colors.green.blue(updated_package_version)}`
					);
					package_package_json_data[dependency_type][updated_package_name] = updated_package_version;
				}
			});
		}
		console.log();

		await fs.promises.writeFile(package_package_json_path, JSON.stringify(package_package_json_data, null, 2), 'utf-8');
	}
}
