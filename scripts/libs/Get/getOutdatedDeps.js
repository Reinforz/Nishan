"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutdatedDeps = void 0;
const __1 = require("../");
async function getOutdatedDeps() {
    const package_map = await __1.NishanScripts.Create.packageMap(), outdated_dependency_map = new Map();
    for (const [, { dependencies }] of package_map) {
        Object.entries(dependencies).forEach(([dependency_name, dependency_version]) => {
            const dependency_info = package_map.get(dependency_name);
            if (dependency_version.replace(/(\^|~)/g, '') !== dependency_info.version.replace(/(\^|~)/g, ''))
                outdated_dependency_map.set(dependency_name, dependency_info.version);
        });
    }
    return outdated_dependency_map;
}
exports.getOutdatedDeps = getOutdatedDeps;
//# sourceMappingURL=getOutdatedDeps.js.map