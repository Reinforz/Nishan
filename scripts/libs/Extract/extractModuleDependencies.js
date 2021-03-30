"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractModuleDependencies = void 0;
const typescript_1 = __importDefault(require("typescript"));
const extractModuleDependencies = (module_path) => {
    const program = typescript_1.default.createProgram([module_path], { allowJs: true }), sourceFile = program.getSourceFile(module_path), imported_module_dependencies = new Set();
    sourceFile.imports.forEach((node) => {
        imported_module_dependencies.add(node.text);
    });
    return imported_module_dependencies;
};
exports.extractModuleDependencies = extractModuleDependencies;
//# sourceMappingURL=extractModuleDependencies.js.map