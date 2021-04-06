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