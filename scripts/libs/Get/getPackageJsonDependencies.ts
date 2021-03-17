import fs from 'fs';
import path from 'path';

export const getPackageJsonDependencies = async (package_name: string) => {
	const package_json_path = path.resolve(__dirname, `../../../../packages/${package_name}/package.json`);
	const package_json_data = JSON.parse(await fs.promises.readFile(package_json_path, 'utf-8'));
	return { ...(package_json_data.dependencies ?? {}), ...(package_json_data.devDependencies ?? {})} as Record<string, string>;
};
