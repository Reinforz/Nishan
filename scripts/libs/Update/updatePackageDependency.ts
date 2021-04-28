import colors from 'colors';
import fs from 'fs';
import { NishanScripts } from '../';
import { IPackageMap } from '../types';

export async function updatePackageDependency(
  package_name: string,
  packages_map: IPackageMap
) {
  const {
    package_json_data,
    package_json_path
  } = await NishanScripts.Get.packageJsonData(package_name);
  const package_info = packages_map.get(package_name);
  if (package_info) {
    console.log(colors.bold.blue(`${package_name} ${package_info.version}`));
    package_json_data.version = package_info.version;
  }

  ['dependencies', 'devDependencies'].forEach((dependency_type) => {
    Object.keys(package_json_data[dependency_type] ?? {}).forEach(
      (dependency_name) => {
        const packages_deps_info = packages_map.get(dependency_name)!;
        if (packages_deps_info) {
          package_json_data[dependency_type][dependency_name] =
            packages_deps_info.version;
          if (
            package_json_data[dependency_type][dependency_name] !==
            packages_deps_info.version
          )
            console.log(
              colors.bold.blue(
                `${dependency_type} ${dependency_name} ${packages_deps_info.version}`
              )
            );
        }
      }
    );
  });

  await fs.promises.writeFile(
    package_json_path,
    JSON.stringify(package_json_data, null, 2),
    'utf-8'
  );
}
