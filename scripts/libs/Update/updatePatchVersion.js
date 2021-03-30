"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatchVersion = void 0;
function updatePatchVersion(updated_packages, package_map, amount) {
    const updated_package_version = new Map();
    updated_packages.forEach((updated_package_name) => {
        const [major, minor, patch] = package_map.get(updated_package_name).version.split('.');
        updated_package_version.set(updated_package_name, `${major}.${minor}.${parseInt(patch) + amount}`);
    });
    return updated_package_version;
}
exports.updatePatchVersion = updatePatchVersion;
//# sourceMappingURL=updatePatchVersion.js.map