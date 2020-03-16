# logger

[https://github.com/gokker-tech/logger](http://github.com/gokker-tech/logger)

## USAGE

This logger has 3 different levels of logging in a specific order:

    'error', 'warn', 'info'
    
Each of these log levels has its own method on the logging instance. 

Currently, this logger writes to STDOUT.

### Instantiation:

    var logger = require('./logger') // logs to STDOUT
