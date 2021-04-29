import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { createDependencyMap } from '../Create/createDependencyMap';
import { createPackageMap } from '../Create/createPackageMap';
import { createPackagePublishOrder } from '../Create/createPackagePublishOrder';
import { publishAfterBuild } from '../Publish/publishAfterBuild';

export async function publishUpdatedPackages(
  updated_packages_name: string[] | string | true
) {
  const [packages_map, package_dirs] = await createPackageMap();
  let rearranged_packages: string[] = [];
  if (Array.isArray(updated_packages_name)) {
    const package_dependency_map = createDependencyMap(
      updated_packages_name,
      packages_map
    );
    rearranged_packages = createPackagePublishOrder(
      Array.from(package_dependency_map.all.keys()),
      packages_map
    );
  } else if (updated_packages_name === '*') {
    const package_dependency_map = createDependencyMap(
      package_dirs.filter(
        (package_dir) => packages_map.get(`@nishans/${package_dir}`)?.published
      ),
      packages_map
    );
    rearranged_packages = createPackagePublishOrder(
      Array.from(package_dependency_map.all.keys()),
      packages_map
    );
  } else
    rearranged_packages = JSON.parse(
      await fs.promises.readFile(
        path.resolve(__dirname, '../../../data/non_builded_packages.json'),
        'utf-8'
      )
    );

  console.log(`Building ${rearranged_packages.length} packages`);
  console.log(colors.blue.bold(rearranged_packages.join('\n')));

  await publishAfterBuild(rearranged_packages, packages_map);
}
