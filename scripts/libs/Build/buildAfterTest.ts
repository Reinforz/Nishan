import cp from 'child_process';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { NishanScripts } from '../';

function sleep(time: number){
  return new Promise((resolve)=>setTimeout(()=>resolve(true), time));
}

export async function buildAfterTest (packages: string[], resume?: boolean, cbs?: (package_name: string, step: string) => any) {
  resume = resume ?? false;

	const packages_dir = path.resolve(__dirname, '../../../../packages');
  const reversed_packages = [...packages].reverse();
  const non_builded_packages_data_path = path.resolve(__dirname, '../../../data/non_builded_packages.json');

  const non_builded_packages = resume ? JSON.parse(await fs.promises.readFile(non_builded_packages_data_path, 'utf-8')) : packages;
  
  const packages_map = await NishanScripts.Create.packageMap();
	const packages_deps_version_map = NishanScripts.Update.patchVersion(non_builded_packages, packages_map, 1);
	for (let index = 0; index < non_builded_packages.length; index++) {
		const package_name = non_builded_packages[index].split('/')[1];
		const package_dir = path.join(packages_dir, package_name);
		console.log(colors.green.bold(`Building ${non_builded_packages[index]}`));
    const non_installed_deps = await NishanScripts.Get.packageNonInstalledDependencies(package_name);
    if(Array.from(non_installed_deps.keys()).length !==0 ){
      console.log(non_installed_deps);
      throw new Error(`Uninstalled deps in @nishans/${package_name}`)
    }
    await sleep(500);
    cbs && cbs(package_name, 'import_checker');
    const {package_json_data} = (await NishanScripts.Get.packageJsonData(non_builded_packages[index]));
		try {
      if(package_json_data?.scripts?.test){
        await sleep(500);
        cp.execSync(`npm run test`, { cwd: package_dir });
        console.log(colors.green.bold(`Test completed`));
        cbs && cbs(package_name, 'test');
      }
      await sleep(500);
			cp.execSync(`npx del-cli ./dist`, { cwd: package_dir });
			console.log(colors.green.bold(`Deleted dist folder`));
      await sleep(500);
			cp.execSync(`npm run build`, { cwd: package_dir });
			console.log(colors.green.bold(`Regular transpile completed`));
      cbs && cbs(package_name, 'transpile');
      await sleep(500);
			cp.execSync(`tsc --sourceMap false --removeComments --declaration false`, {
				cwd: package_dir
			});
			console.log(colors.green.bold(`Nocomments transpile completed`));
      cbs && cbs(package_name, 'transpile_nocomments');
      await sleep(500);
      await NishanScripts.Update.packageDependency(packages_deps_version_map, non_builded_packages[index]);
      cbs && cbs(package_name, 'update_json');

      await sleep(500);
      cbs && cbs(package_name, 'publish');
      if(1 === 1){
        throw new Error();
      }
		} catch (err) {
			console.log(colors.red.bold(`Error encountered in ${package_name}`));
			console.log(err.message);
      await fs.promises.writeFile(non_builded_packages_data_path, JSON.stringify(reversed_packages.reverse(), null, 2), 'utf-8');
      break;
		}
    reversed_packages.pop();
	}
}
