import cp from 'child_process';
import colors from 'colors';
import path from 'path';

export async function publishPackages (package_dirs: string[]) {
	for (let index = 0; index < package_dirs.length; index++) {
		const package_dir = package_dirs[index].split('/')[1];
		const package_name = path.basename(package_dir);
		package_dirs.push(package_dir);
		try {
			cp.execSync(`npm run publish`, { cwd: package_dir });
			console.log(colors.green.bold(`Published ${package_name}`));
		} catch (err) {
			console.log(colors.red.bold(`Error encountered in ${package_name}`));
			console.log(err.stdout.toString());
			break;
		}
	}
}
