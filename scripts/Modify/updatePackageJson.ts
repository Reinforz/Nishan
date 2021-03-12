import fs from 'fs';

export async function updatePackageJson (package_json_path: string, description: string) {
	const package_json_data = JSON.parse(await fs.promises.readFile(package_json_path, 'utf-8'));
	if (package_json_data.description !== description) {
		package_json_data.description = description;
		await fs.promises.writeFile(package_json_path, JSON.stringify(package_json_data, null, 2), 'utf-8');
	}
}
