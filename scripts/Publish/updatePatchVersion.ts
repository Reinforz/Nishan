export function updatePatchVersion (updated_packages_map: Map<string, string>) {
	Array.from(updated_packages_map.entries()).forEach(([ updated_package_name, updated_package_version ]) => {
		const [ major, minor, patch ] = updated_package_version.split('.');
		updated_packages_map.set(updated_package_name, `${major}.${minor}.${parseInt(patch) + 1}`);
	});
}
