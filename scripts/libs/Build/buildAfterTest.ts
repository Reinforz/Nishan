import cp from 'child_process';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { getPackageNonInstalledDependencies } from '../Get/getPackageNonInstalledDependencies';

export async function buildAfterTest (packages: string[]) {
	const packages_dir = path.resolve(__dirname, '../../../../packages');
	for (let index = 0; index < packages.length; index++) {
		const package_name = packages[index].split('/')[1];
		const package_dir = path.join(packages_dir, package_name);
		console.log(colors.green.bold(`Building ${packages[index]}`));
    const non_installed_deps = await getPackageNonInstalledDependencies(package_name);
    if(Array.from(non_installed_deps.keys()).length !==0 ){
      console.log(non_installed_deps);
      throw new Error(`Uninstalled deps in @nishans/${package_name}`)
    }
    const package_json_data = JSON.parse(await fs.promises.readFile(path.join(package_dir, 'package.json'), 'utf-8'))
		try {
      if(package_json_data?.scripts?.test){
        cp.execSync(`npm run test`, { cwd: package_dir });
        console.log(colors.green.bold(`Test completed`));
      }
			cp.execSync(`npx del-cli ./dist`, { cwd: package_dir });
			console.log(colors.green.bold(`Deleted dist folder`));
			cp.execSync(`npm run build`, { cwd: package_dir });
			console.log(colors.green.bold(`Regular transpile completed`));
			cp.execSync(`tsc --sourceMap false --removeComments --declaration false`, {
				cwd: package_dir
			});
			console.log(colors.green.bold(`Nocomments transpile completed`));
      console.log();
		} catch (err) {
			console.log(colors.red.bold(`Error encountered in ${package_name}`));
			console.log(err.message);
      process.exit(0);
			break;
		}
	}
}
