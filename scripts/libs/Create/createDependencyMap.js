"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDependencyMap = void 0;
function createDependencyMap(package_names, packages_map) {
    const package_dependency_map = {
        main: new Map(),
        direct: new Map(),
        indirect: new Map(),
        all: new Map()
    };
    for (const package_name of package_names) {
        const package_info = packages_map.get(`@nishans/${package_name}`);
        package_dependency_map.main.set(package_info.name, package_info.version);
        package_dependency_map.all.set(package_info.name, package_info.version);
        function traverse(dependents, level) {
            Object.entries(dependents)
                .filter(([dependent_name]) => !package_dependency_map.all.get(dependent_name))
                .forEach(([dependent_name, dependent_version]) => {
                if (dependent_version !== '0.0.0') {
                    package_dependency_map.all.set(dependent_name, dependent_version);
                    if (level === 0)
                        package_dependency_map.direct.set(dependent_name, dependent_version);
                    else
                        package_dependency_map.indirect.set(dependent_name, dependent_version);
                    traverse(packages_map.get(dependent_name).dependents, level + 1);
                }
            });
        }
        traverse(package_info.dependents, 0);
    }
    return package_dependency_map;
}
exports.createDependencyMap = createDependencyMap;
//# sourceMappingURL=createDependencyMap.js.map