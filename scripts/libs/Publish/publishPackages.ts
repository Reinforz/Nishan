import cp from 'child_process';
import colors from 'colors';
import path from 'path';
import { NishanScripts } from '..';

export async function publishPackages (packages_deps_version_map: Map<string, string>) {
	const packages_dir = path.resolve(__dirname, '../../../../packages');
	for (const [ scoped_package_name ] of Array.from(packages_deps_version_map.entries())) {
		const package_name = scoped_package_name.split('/')[1];
		try {
			await NishanScripts.Update.packageDependency(packages_deps_version_map, scoped_package_name);
			cp.execSync(`npm publish`, { cwd: path.join(packages_dir, package_name) });
			console.log(colors.green.bold(`Published ${package_name}`));
		} catch (err) {
			console.log(colors.red.bold(`Error encountered in ${package_name}`));
			console.log(err.stdout.toString());
			break;
		}
	}
}
