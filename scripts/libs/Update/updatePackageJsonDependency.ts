import colors from 'colors';
import fs from 'fs';
import { NishanScripts } from '../';

export async function updatePackageJsonDependency (packages_version_map: Map<string, string>, package_name: string) {
  const package_version = packages_version_map.get(package_name)!;
  console.log(colors.white.bold(package_name));
  console.log(colors.yellow.bold(`Updating ${package_name} to ${package_version}`));

  const {package_json_data, package_json_path} = await NishanScripts.Get.packageJsonData(package_name);

  package_json_data.version = package_version;

  for (const [ updated_package_name, updated_package_version ] of Array.from(packages_version_map.entries())) {
    [ 'dependencies', 'devDependencies' ].forEach((dependency_type) => {
      if (package_json_data[dependency_type]?.[updated_package_name]) {
        console.log(
          `DEP ${colors.blue.bold(updated_package_name)} : ${colors.red.bold(
            package_json_data[dependency_type][updated_package_name]
          )} => ${colors.green.blue(updated_package_version)}`
        );
        package_json_data[dependency_type][updated_package_name] = updated_package_version;
      }
    });
  }
  console.log();

  await fs.promises.writeFile(package_json_path, JSON.stringify(package_json_data, null, 2), 'utf-8');
}
