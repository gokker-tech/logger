# logger

[https://github.com/grokker-tech/logger](http://github.com/grokker-tech/logger)

## USAGE

This logger has 4 different levels of logging in a specific order:

    'ERROR', 'WARN', 'INFO' 'DEBUG'
    
Each of these log levels has its own method on the logging instance. Just set LOGGER_LOG_LEVEL in environment variable to set your log level. By default it is set to INFO

Currently, this logger writes to STDOUT.

### Instantiation:

    const logger = require('@grokker/logger') // logs to STDOUT

### Usage:

    export LOGGER_LOG_LEVEL=DEBUG

All of the logging methods take n arguments, which are joined by ' ' just like **console**, the error handler is designed to handle **axios** api call errors by default, it will stringify all json data for better visibility.
The output contains some extra information such as timestamp, log level and name of the file from where the logger function was called.  


    logger.info('Hello', 'world', '-', {a : 'This is an object'});
    // => 2020-03-16T18:19:30.569Z  [ INFO  ]  --- [   logger/test.js   ] :  Hello world - {"a":"This is an object"}
    
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
    
    logger.info('Hello', 'world', '-', {a : 'This is an object'});
    // => 2020-03-16T18:19:30.569Z  [ DEBUG ]  --- [   logger/test.js   ] :  this is object - { a: 'This is an object',
                                                                                b: [ { c: 'This is array of objects' } ] }
    
### ISSUES:
Feel free to fork it or raise a issue at 

    https://github.com/grokker-tech/logger/issues
    
### LICENSE

    MIT
    
