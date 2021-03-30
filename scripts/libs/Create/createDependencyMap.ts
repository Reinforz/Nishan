import fs from 'fs';
import path from 'path';
import { IPackageDependencyMap, IPackageMap } from '../types';
import { jsonReplacer, jsonReviver } from '../utils';

export async function createDependencyMap (package_names: string[], packages_map: IPackageMap, resume?: boolean) {
  resume = resume ?? false;
	const package_dependency_map: IPackageDependencyMap = {
		main: new Map(),
		direct: new Map(),
		indirect: new Map(),
		all: new Map()
	};
  const package_map_json_data_path = path.resolve(__dirname, '../../../data/package_dependency_map.json');

  if(!resume){
    for (const package_name of package_names) {
      const package_info = packages_map.get(`@nishans/${package_name}`)!;
      package_dependency_map.main.set(package_info.name, package_info.version);
      package_dependency_map.all.set(package_info.name, package_info.version);
  
      function traverse (dependents: Record<string, string>, level: number) {
        Object.entries(dependents)
          .filter(([ dependent_name ]) => !package_dependency_map.all.get(dependent_name))
          .forEach(([ dependent_name, dependent_version ]) => {
            if (dependent_version !== '0.0.0') {
              package_dependency_map.all.set(dependent_name, dependent_version);
              if (level === 0) package_dependency_map.direct.set(dependent_name, dependent_version);
              else package_dependency_map.indirect.set(dependent_name, dependent_version);
              traverse(packages_map.get(dependent_name)!.dependents, level + 1);
            }
          });
      }
  
      traverse(package_info.dependents, 0);
    }
    
    await fs.promises.writeFile(package_map_json_data_path, JSON.stringify(package_dependency_map, jsonReplacer, 2), 'utf-8');
    return package_dependency_map;
  }else
    return JSON.parse(await fs.promises.readFile(package_map_json_data_path, 'utf-8'), jsonReviver) as IPackageDependencyMap;
}
