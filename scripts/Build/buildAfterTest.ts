import cp from 'child_process';
import colors from 'colors';
import path from 'path';

export function buildAfterTest (packages: string[]) {
	const packages_dir = path.resolve(__dirname, '../../../packages'),
		package_dirs: string[] = [];
	for (let index = 0; index < packages.length; index++) {
		const package_name = packages[index].split('/')[1];
		const package_dir = path.join(packages_dir, package_name);
		console.log(colors.green.bold(`Building ${packages[index]}`));
		package_dirs.push(package_dir);
		try {
			cp.execSync(`npm run test`, { cwd: package_dir });
			console.log(colors.green.bold(`Test completed`));
			cp.execSync(`npx del-cli ./dist`, { cwd: package_dir });
			console.log(colors.green.bold(`Deleted dist folder`));
			cp.execSync(`npm run build`, { cwd: package_dir });
			console.log(colors.green.bold(`Regular build completed`));
			cp.execSync(`tsc --sourceMap false --removeComments --declaration false`, {
				cwd: package_dir
			});
			console.log(colors.green.bold(`Nocomments build completed`));
		} catch (err) {
			console.log(colors.red.bold(`Error encountered in ${package_name}`));
			console.log(err.stdout.toString());
			break;
		}
	}
	return package_dirs;
}
