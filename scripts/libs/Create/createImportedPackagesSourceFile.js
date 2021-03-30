"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImportedPackagesSourceFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const packages_json_1 = __importDefault(require("../../packages.json"));
async function createImportedPackagesSourceFile() {
    const import_declarations = [];
    const printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
    packages_json_1.default.forEach((package_data) => {
        if (package_data.published) {
            /* const package_name_chunks = package_data.name.split('/')[1].split('-');
            const package_import_identifier =
                'Nishan' +
                package_name_chunks
                    .map((package_name_chunk) => package_name_chunk.charAt(0).toUpperCase() + package_name_chunk.substr(1))
                    .join(''); */
            if (package_data.name !== '@nishans/types')
                import_declarations.push(typescript_1.default.factory.createExportDeclaration(undefined, undefined, false, typescript_1.default.factory.createIdentifier('*'), typescript_1.default.factory.createStringLiteral(package_data.name)));
        }
    });
    const temp_file = typescript_1.default.createSourceFile('someFileName.ts', '', typescript_1.default.ScriptTarget.Latest, false, typescript_1.default.ScriptKind.TS);
    await fs_1.default.promises.writeFile(path_1.default.join(path_1.default.resolve(__dirname, '../../../../'), 'test.ts'), printer.printList(typescript_1.default.ListFormat.PreferNewLine, typescript_1.default.factory.createNodeArray(import_declarations), temp_file));
}
exports.createImportedPackagesSourceFile = createImportedPackagesSourceFile;
createImportedPackagesSourceFile();
//# sourceMappingURL=createImportedPackagesSourceFile.js.map