# `@nishans/restore`

<p align="center">
  <img src="https://img.shields.io/bundlephobia/minzip/@nishans/restore?label=minzipped&style=flat"/>
  <img src="https://img.shields.io/npm/dw/@nishans/restore?style=flat">
  <img src="https://img.shields.io/github/issues/devorein/nishan/@nishans/restore">
  <img src="https://img.shields.io/npm/v/@nishans/restore">
</p>

A package to export local notion data into notion or remote dbaas like mongodb Atlas

# Usage

This small package exposes four methods to facilitate restoring notion using either local file or remote/local mongodb instances

1. `restoreAtlasFromLocalFile`: Stores notion data from local file to a remote atlas one
2. `restoreAtlasFromMongodb`: Stores notion data from local mongodb instance to a remote atlas one
3. `restoreNotionFromMongodb`: Restore notion from data stored in local or remote mongodb instance
4. `restoreNotionFromLocalFile`: Restore notion from data stored in local file

## Note

Currently this package only supports collection blocks or collection view pages not regular pages or other kinds of blocks