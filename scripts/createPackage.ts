import dedent from 'dedent';
import fs from 'fs';
import path from 'path';

async function main () {
	const [ package_name ] = process.argv.slice(2);

	const packages_dir = path.resolve(__dirname, '../../packages'),
		package_root_dir = path.join(packages_dir, package_name),
		package_tests_dir = path.join(package_root_dir, 'tests'),
		package_libs_dir = path.join(package_root_dir, 'libs');

	const package_tsconfig_file_path = path.join(package_root_dir, 'tsconfig.json'),
		package_packagejson_file_path = path.join(package_root_dir, 'package.json'),
		package_lib_index_file_path = path.join(package_libs_dir, 'index.ts'),
		package_readme_file_path = path.join(package_root_dir, 'readme.md');

	await fs.promises.mkdir(package_root_dir);
	await fs.promises.mkdir(package_tests_dir);
	await fs.promises.mkdir(package_libs_dir);
	await fs.promises.writeFile(
		package_tsconfig_file_path,
		dedent`{
      "extends": "../../tsconfig.shared.json",
      "include": [
        "./libs/index.ts",
        "./experiment",
        "./examples"
      ],
      "compilerOptions": {
        "outDir": "./dist",
        "rootDir": "./",
      },
    }`,
		'utf-8'
	);
	await fs.promises.writeFile(
		package_packagejson_file_path,
		dedent`{
      "name": "@nishans/${package_name}",
      "version": "0.0.0",
      "description": "",
      "keywords": [],
      "author": "Safwan Shaheer <devorein00@gmail.com>",
      "homepage": "https://github.com/Devorein/Nishan/blob/master/packages/${package_name}/README.md",
      "license": "MIT",
      "main": "dist/libs/index.js",
      "typings": "dist/libs/index.d.ts",
      "directories": {
        "lib": "libs",
        "test": "tests"
      },
      "files": [
        "dist/libs"
      ],
      "repository": {
        "type": "git",
        "url": "git+https://github.com/Devorein/Nishan.git"
      },
      "scripts": {
        "prepublishOnly": "npm run build && npm run build:nocomments",
        "prebuild": "npm run test",
        "build": "npx del-cli ./dist && tsc --sourceMap false",
        "test": "npx jest --runInBand --config ../../jest.config.js",
        "build:nocomments": "tsc -p ./tsconfig.nocomments.json --sourceMap false"
      },
      "bugs": {
        "url": "https://github.com/Devorein/Nishan/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%40nishans%2F${package_name}"
      },
      "dependencies": {},
      "devDependencies": {
        "@nishans/types": "^0.0.0"
      }
    }`,
		'utf-8'
	);
	await fs.promises.writeFile(package_lib_index_file_path, ``, 'utf-8');
	await fs.promises.writeFile(
		package_readme_file_path,
		dedent`# \`@nishans/${package_name}\`
    
      <p align="center">
        <img width="125" src="https://github.com/Devorein/Nishan/blob/master/docs/static/img/${package_name}/logo.svg"/>
      </p>
      
      <p align="center">
        <img src="https://img.shields.io/bundlephobia/minzip/@nishans/${package_name}?label=minzipped&style=flat&color=%23bb0a1e"/>
        <img src="https://img.shields.io/npm/dw/@nishans/${package_name}?style=flat&color=orange"/>
        <img src="https://img.shields.io/github/issues/devorein/nishan/@nishans/${package_name}?color=yellow"/>
        <img src="https://img.shields.io/npm/v/@nishans/${package_name}?color=%2303C04A"/>
        <img src="https://img.shields.io/codecov/c/github/devorein/Nishan?flag=${package_name}&color=blue"/>
        <img src="https://img.shields.io/librariesio/release/npm/@nishans/${package_name}?color=%234B0082">
      </p>
      
      <p align="center">
        | <a href="https://github.com/Devorein/Nishan/tree/master/packages/${package_name}">Github</a> |
        <a href="https://nishan-docs.netlify.app/docs/${package_name}/">Docs</a> |
        <a href="https://www.npmjs.com/package/@nishans/${package_name}">NPM</a> |
        <a href="https://discord.com/invite/SpwHCz8ysx">Discord</a> |
      </p>
      
      <p align="center"><b></b></p>`,
		'utf-8'
	);
}

main();
