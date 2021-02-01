This package provides out of the box typescript support for both object and array representation.

## Array representation

This package provides types to check the simple Array representation argument statically.

```ts
import {generateFormulaASTFromArray} from "@nishans/notion-formula";

// Ts complains as pow requires an arguments array
generateFormulaASTFromArray([ 'pow' ]);

// Ts complains as pow requires two arguments
generateFormulaASTFromArray([ 'pow', [1, 2] ]);

// Ts complains as pow requires two number arguments, here the first is a string
generateFormulaASTFromArray([ 'pow', ['1', 2] ]);

// The same error as above but here 
// the first argument is another formula that returns a string
generateFormulaASTFromArray([ 'pow', [['concat', ['a','b']], 2] ]);
```

## Object representation

This package provides types to check the simple Object representation argument statically.

```ts
import {generateFormulaASTFromObject} from "@nishans/notion-formula";

// Ts complains as pow requires an arguments array
generateFormulaASTFromObject({
  function: 'pow'
});

// Ts complains as pow requires two arguments
generateFormulaASTFromObject({
  function: 'pow',
  args: [1]
});

// Ts complains as pow requires two number arguments, here the first is a string
generateFormulaASTFromObject({
  function: 'pow',
  args: ['1', 1]
});

// The same error as above but here 
// the first argument is another formula that returns a string
generateFormulaASTFromObject({
  function: 'pow',
  args: [{
    function: 'concat',
    args: ['a', 'b']
  }, 1]
});
```