import fs from 'fs';
import path from 'path';
import { extractDependencies } from '../Extract/extractDependencies';
import { IPackageMap } from '../types';

export async function createPackageMap() {
  const packages_dir = path.resolve(__dirname, '../../../../packages'),
    package_dirs = await fs.promises.readdir(packages_dir),
    packages_map: IPackageMap = new Map();

  for (const package_dir of package_dirs) {
    const package_package_json_data = JSON.parse(
      await fs.promises.readFile(
        path.join(packages_dir, package_dir, 'package.json'),
        'utf-8'
      )
    );
    packages_map.set(`@nishans/${package_dir}`, {
      dependencies: extractDependencies({
        ...(package_package_json_data.dependencies ?? {}),
        ...(package_package_json_data.devDependencies ?? {})
      }),
      version: package_package_json_data.version,
      dependents: {},
      name: `@nishans/${package_dir}`,
      description: package_package_json_data.description,
      published: package_package_json_data.version !== '0.0.0'
    });
  }
  const package_entries = Array.from(packages_map.entries());
  package_entries.forEach(([package_name, package_info]) => {
    const dependencies = Object.keys(package_info.dependencies);
    dependencies.forEach((dependency) => {
      const package_map = packages_map.get(dependency);
      if (package_map)
        package_map.dependents[package_name] = package_info.version;
    });
  });

  return [packages_map, package_dirs] as const;
}
