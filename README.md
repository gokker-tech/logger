# logger

[https://github.com/grokker-tech/logger](http://github.com/grokker-tech/logger)

## USAGE

This logger has 3 different levels of logging in a specific order:

    'error', 'warn', 'info'
    
Each of these log levels has its own method on the logging instance. 

Currently, this logger writes to STDOUT.

### Instantiation:

    const logger = require('./index') // logs to STDOUT

### Usage:

All of the logging methods take n arguments, which are joined by ' ' just like **console**, the error handler is designed to handle **axios** api call errors.
The output contains some extra information such as timestamp, log level and name of the file from where the logger function was called.  


    logger.info('Hello', 'world');
    // => 2020-03-16T18:19:30.569Z  [ INFO  ]  --- [   logger/test.js   ] :  Hello world
    logger.warn('It\'s a warning');
    // => 2020-03-16T18:19:30.569Z  [ WARN  ]  --- [   logger/test.js   ] :  It's a warning
    
    try {
        throw Error('Throwing an error');
    }catch (e) {
        logger.error(e);
    }
    /***
        => 2020-03-16T18:24:05.086Z  [ ERROR ]  --- [   logger/test.js   ] :  Error: Throwing an error
              at Object.<anonymous> ($PROJECT_PATH/logger/test.js:4:11)
              at Module._compile (internal/modules/cjs/loader.js:778:30)
              at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)
              at Module.load (internal/modules/cjs/loader.js:653:32)
              at tryModuleLoad (internal/modules/cjs/loader.js:593:12)
              at Function.Module._load (internal/modules/cjs/loader.js:585:3)
              at Function.Module.runMain (internal/modules/cjs/loader.js:831:12)
              at startup (internal/bootstrap/node.js:283:19)
              at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)
    ***/
    
### ISSUES:
Feel free to fork it or raise a issue at 

    https://github.com/grokker-tech/logger/issues
    
### LICENSE

    MIT
    
