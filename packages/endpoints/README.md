# `@nishans/endpoints`

<p align="center">
  <img width="125" src="https://github.com/Devorein/Nishan/blob/master/docs/static/img/endpoints/logo.svg"/>
</p>

<p align="center">
  <img src="https://img.shields.io/bundlephobia/minzip/@nishans/endpoints?label=minzipped&style=flat"/>
  <img src="https://img.shields.io/npm/dw/@nishans/endpoints?style=flat"/>
  <img src="https://img.shields.io/github/issues/devorein/nishan/@nishans/endpoints"/>
  <img src="https://img.shields.io/npm/v/@nishans/endpoints"/>
  <img src="https://img.shields.io/codecov/c/github/devorein/Nishan?flag=endpoints"/>
</p>

<p align="center">
  <a href="https://github.com/Devorein/Nishan/tree/master/packages/endpoints">Github</a>
  <a href="https://nishan-docs.netlify.app/docs/endpoints/">Docs</a>
  <a href="https://www.npmjs.com/package/@nishans/endpoints">NPM</a>
  <a href="https://discord.com/invite/SpwHCz8ysx">Discord</a>
</p>

<p align="center"><b>
A package to expose all notion endpoints for queries and mutations and cache response</b></p>

## Features

1. Auto cache for specific requests
2. Type definitions attached with each mutation and query endpoint function
3. A class unifying `Cache`, `Queries` and `Mutations` to make sending api requests easier
4. Separate functions corresponding to all the endpoint requests
5. Inbuilt interval option to guard against unintentional extraneous requests
6. Brief documentation on the purpose of each endpoint

## API

This package exports three classes to interact with notion's endpoints

1. [**Cache**](https://github.com/Devorein/Nishan/blob/master/packages/endpoints/docs/Cache.md): A class to cache the response returned from the rest endpoints 
2. [**Queries**](https://github.com/Devorein/Nishan/blob/master/packages/endpoints/docs/Queries.md): A class containing most of the query related notion endpoints
3. [**Mutations**](https://github.com/Devorein/Nishan/blob/master/packages/endpoints/docs/Mutations.md): A class containing most of the mutation related notion endpoints
