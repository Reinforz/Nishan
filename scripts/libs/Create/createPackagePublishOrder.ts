import fs from 'fs';
import path from 'path';
import { IPackageMap } from '../types';
import { jsonReplacer, jsonReviver } from '../utils';

export async function createPackagePublishOrder (updated_packages: string[], packages_map: IPackageMap, resume?: boolean) {
  resume = resume ?? false;
  const package_publish_order_json_path = path.resolve(__dirname, '../../../data/package_publish_order.json');

  if(!resume){
    const package_publish_order = updated_packages
    .sort((updated_package_a, updated_package_b) => {
      const package_a_map = packages_map.get(updated_package_a)!,
        package_b_map = packages_map.get(updated_package_b)!;
      if (package_a_map.dependents[`${updated_package_b}`]) return 1;
      else if (package_b_map.dependents[`${updated_package_a}`]) return -1;
      else return 0;
    })
    .reduce((arr, rearranged_package) => [ ...arr, rearranged_package ], [] as string[])
    .reverse();

    await fs.promises.writeFile(package_publish_order_json_path, JSON.stringify(package_publish_order, jsonReplacer, 2), 'utf-8');
    return package_publish_order;
  }else
    return JSON.parse(await fs.promises.readFile(package_publish_order_json_path, 'utf-8'), jsonReviver) as string[];
}
