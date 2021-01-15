# `@nishans/store`

<p align="center">
  <img src="https://img.shields.io/bundlephobia/minzip/@nishans/store?label=minzipped&style=flat"/>
  <img src="https://img.shields.io/npm/dw/@nishans/store?style=flat">
  <img src="https://img.shields.io/github/issues/devorein/nishan/@nishans/store">
  <img src="https://img.shields.io/npm/v/@nishans/store">
</p>

A package to export remote notion data into local file system in various formats or in monogdb instance

## Usage

This small package exposes four methods to facilitate downloading notion data

1. `storeInLocalFileFromNotion`: Stores data from notion collection block into a local file
2. `storeInLocalFileFromMongodb`: Stores data from local mongodb instance into a local file
3. `storeInLocalMongodbFromFile`: Stores data from local file from file system into local mongodb instance
4. `storeInLocalMongodbFromNotion`: Stores data from notion collection block into local mongodb instance