import cp from 'child_process';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { NishanScriptsGet } from '../Get';

export async function buildAfterTest (packages: string[], resume?: boolean) {
  resume = resume ?? false;
	const packages_dir = path.resolve(__dirname, '../../../../packages');
  const reversed_packages = [...packages].reverse();
  const non_builded_packages_data_path = path.resolve(__dirname, '../../../data/non_builded_packages.json');

  const non_builded_packages = resume ? JSON.parse(await fs.promises.readFile(non_builded_packages_data_path, 'utf-8')) : packages;
  
	for (let index = 0; index < non_builded_packages.length; index++) {
		const package_name = non_builded_packages[index].split('/')[1];
		const package_dir = path.join(packages_dir, package_name);
		console.log(colors.green.bold(`Building ${non_builded_packages[index]}`));
    const non_installed_deps = await NishanScriptsGet.packageNonInstalledDependencies(package_name);
    if(Array.from(non_installed_deps.keys()).length !==0 ){
      console.log(non_installed_deps);
      throw new Error(`Uninstalled deps in @nishans/${package_name}`)
    }
    const {package_json_data} = (await NishanScriptsGet.packageJsonData(non_builded_packages[index]));
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
      await fs.promises.writeFile(non_builded_packages_data_path, JSON.stringify(reversed_packages.reverse(), null, 2), 'utf-8');
      process.exit(0);
		}
    reversed_packages.pop();
	}
}
