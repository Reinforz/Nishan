"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDependencies = void 0;
const extractDependencies = (dependencies) => {
    const trimmed_dependencies = {};
    Object.keys(dependencies).forEach((dependency) => {
        if (dependency.startsWith('@nishans'))
            trimmed_dependencies[dependency] = dependencies[dependency];
    });
    return trimmed_dependencies;
};
exports.extractDependencies = extractDependencies;
//# sourceMappingURL=extractDependencies.js.map