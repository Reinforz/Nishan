import cp from 'child_process';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { NishanScripts } from '../';
import { IPackageMap } from '../types';

/* function sleep(time: number){
  return new Promise((resolve)=>setTimeout(()=>resolve(true), time));
} */

export async function publishAfterBuild (packages: string[], packages_map: IPackageMap, cbs?: (package_name: string, step: string) => any) {
	const packages_dir = path.resolve(__dirname, '../../../../packages');
  const reversed_packages = [...packages].reverse();
  const non_builded_packages_data_path = path.resolve(__dirname, '../../../data/non_builded_packages.json');


	for (let index = 0; index < packages.length; index++) {
		const package_name = packages[index].split('/')[1];
		const package_dir = path.join(packages_dir, package_name);
		console.log(colors.green.bold(`Building ${packages[index]}`));
    NishanScripts.Update.patchVersion(packages[index], packages_map, 1);
    // const non_installed_deps = await NishanScripts.Get.packageNonInstalledDependencies(package_name);
    // if(Array.from(non_installed_deps.keys()).length !==0 ){
    //   console.log(non_installed_deps);
    //   throw new Error(`Uninstalled deps in @nishans/${package_name}`)
    // }
    // cbs && cbs(package_name, 'import_checker');
    const {package_json_data} = (await NishanScripts.Get.packageJsonData(packages[index]));
		try {
      if(package_json_data?.scripts?.test){
        cp.execSync(`npm run test`, { cwd: package_dir });
        console.log(colors.green.bold(`Test completed`));
        cbs && cbs(package_name, 'test');
      }
      
			cp.execSync(`npx del-cli ./dist`, { cwd: package_dir });
			console.log(colors.green.bold(`Deleted dist folder`));

			cp.execSync(`npm run build`, { cwd: package_dir });
			console.log(colors.green.bold(`Regular transpile completed`));

      cbs && cbs(package_name, 'transpile');
			cp.execSync(`tsc --sourceMap false --removeComments --declaration false`, {
				cwd: package_dir
			});

			console.log(colors.green.bold(`Nocomments transpile completed`));
      cbs && cbs(package_name, 'transpile_nocomments');

      await NishanScripts.Update.packageDependency(packages[index], packages_map);
      cbs && cbs(package_name, 'update_json');

      cp.execSync(`npm publish --access=public`, { cwd: path.join(packages_dir, package_name) });
			console.log(colors.green.bold(`Published ${package_name}`));
      cbs && cbs(package_name, 'publish');
		} catch (err) {
      NishanScripts.Update.patchVersion(packages[index], packages_map, -1);
      await NishanScripts.Update.packageDependency(packages[index], packages_map);
			console.log(colors.red.bold(`Error encountered in ${package_name}`));
			console.log(err.message);
      await fs.promises.writeFile(non_builded_packages_data_path, JSON.stringify(reversed_packages.reverse(), null, 2), 'utf-8');
      break;
		}
    reversed_packages.pop();
	}
}
