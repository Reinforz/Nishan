import cp from 'child_process';
import path from 'path';

export async function publishPackages (packages: string[]) {
	const packages_dir = path.resolve(__dirname, '../../../packages');
	for (let index = 0; index < packages.length; index++) {
		const package_name = packages[index].split('/')[1];
		const package_dir = path.join(packages_dir, package_name);
		cp.exec(`echo ${package_dir}`);
	}
}
