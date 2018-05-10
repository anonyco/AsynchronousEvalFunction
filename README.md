# AsyncGlobalEvalFunction
A simple way to asynchronously defer execution of code stored to prevent execution thread blockage. Example:

```Javascript
AsyncGlobalEvalFunction("function(i){console.log('Hello World, 'i)}", function(f){f(1); f(2); f(3)});
AsyncGlobalEvalFunction("x => x * x", function(f){console.log( f(8) )});
AsyncGlobalEvalFunction("async function * () {}", f => console.log( "Asynchronous generator function (what did you expect?): ", f ));
```


