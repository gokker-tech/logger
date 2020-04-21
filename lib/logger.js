const { loggerLogs, stdWriter } = require('./internalLogger');
const { createFileLogger, createKafkaPayload } = require('./createOutputLogger');
const { CreateProducer } = require('./kafkaPublisher');

const LEVELS = { 'ERROR': 1, 'WARN': 2, 'INFO': 3, 'DEBUG' : 4 };

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// Getting the caller function's file name
const _getCallerFile = () => {
    const originalFunc = Error.prepareStackTrace;
    let callerfile = null;
    try {
        const err = new Error();
        let currentfile = null;
        Error.prepareStackTrace = function (err, stack) { return stack; };
        currentfile = err.stack.shift().getFileName();
        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) break;
        }
    } catch (e) {}
    Error.prepareStackTrace = originalFunc;
    if(callerfile){
        const callerfilePath = callerfile.split('/');
        const pathLength = callerfilePath.length;
        callerfile = pathLength > 2 ? `${callerfilePath[pathLength - 2]}/${callerfilePath[pathLength - 1]}`: callerfilePath[pathLength - 1];
    }
    return callerfile;
};

/*
 * @param {OPTIONS} accepts String "Log Level" defaults to info
 * @param {OPTIONS} accepts object -
 * {
 *  level: {String} [info, warn, debug, error]
 *   output: {String} [file, kafka]
 *  filePath: {String} [{default} : $WORKING_DIR/grokkerLogger/logger_{timestamp}.log]
 *  kafka: {Object} REQUIRED if output is kafka
 *      {
 *          brokers: {String} [Comma separated kafka broker address {default}: localhost:9092]
 *          topic: {String} [Kafka topic name {default}: logger-queue]
 *          esIndex: {String} OPTIONAL [if provided, it will create a logstash object for elasticsearch pipeline]
 *     }
 *  }
*/

const Logger = function (OPTIONS = 'INFO'){
    this.logLevel = typeof OPTIONS === 'string' && LEVELS[OPTIONS.toUpperCase()] ? LEVELS[OPTIONS.toUpperCase()] :
        typeof OPTIONS === 'object' && OPTIONS.level && LEVELS[OPTIONS.level.toUpperCase()] ? LEVELS[OPTIONS.level.toUpperCase()] : LEVELS['INFO'];
        loggerLogs('info','LOG LEVEL is set to -', getKeyByValue(LEVELS, this.logLevel));
    if(OPTIONS.output){
        switch (OPTIONS.output) {
            case 'file': const stream = createFileLogger(OPTIONS);
                this.fileOutPut = true;
                this.writeToFile = function (...text) {
                    stream.write(text.join(' ') + '\n');
                };
                break;
            case 'kafka':
                if(!OPTIONS.kafka){
                    loggerLogs('warn', 'Kafka brokers not provided, writing to std output');
                    break;
                }
                const producer = new CreateProducer(OPTIONS.kafka.brokers || 'localhost:9092');
                this.kafkaoutput = true;
                this.kafkaTopic = OPTIONS.kafka.topic || 'logger-queue';
                this.esIndex = OPTIONS.kafka.esIndex;
                this.publishToKafka = (messages, type) => { producer.publish(messages, type)};
                break;
            default: loggerLogs('error',`No such output method found -`, OPTIONS.output, '- logging to std output');
        }
    }
};

Logger.prototype.logOutput = function (type, formattedLogs, logs) {
    const date = new Date().toISOString();
    const callerFile = `--- [   ${_getCallerFile()}   ] : `;
    let level = [];
    switch (type) {
        case 'info': level = ['\x1b[32m', `[ INFO  ]`, '\x1b[0m'];
            break;
        case 'warn': level = ['\x1b[33m', `[ WARN  ]`, '\x1b[0m'];
            break;
        case 'debug': level = ['\x1b[34m', `[ DEBUG ]`, '\x1b[0m'];
            break;
        case 'error': level = ['\x1b[31m', `[ ERROR ]`, '\x1b[0m'];
            break;
        case 'log': level = ['\x1b[0m', `[ LOG ]`, '\x1b[0m'];
    }
    stdWriter(date, ...level, callerFile, ...formattedLogs);
    this.fileOutPut && this.writeToFile(date, level[1], callerFile, ...formattedLogs);
    const kafkaMessage = createKafkaPayload({date, data: logs, fileName: callerFile, level: type, esIndex: this.esIndex, topic: this.kafkaTopic});
    this.kafkaoutput && this.publishToKafka(kafkaMessage, type);
};

Logger.prototype.info = function (...logs) {
    const formattedArgs = [];
    logs.forEach(arg => {
        formattedArgs.push(typeof arg === 'string' ? arg : JSON.stringify(arg));
    });
    if(this.logLevel - 3 >= 0){
        this.logOutput('info', formattedArgs);
    }
};

Logger.prototype.error = function (...logs){
    let formattedArgs = [];
    try {
        for(let i=0; i<logs.length; i++){
            const arg = logs[i];
            if(!arg){
                continue;
            }
            if(arg.message && arg.response && arg.response.data){
                formattedArgs.push(arg.message);
                formattedArgs.push(JSON.stringify(arg.response.data));
            }else if(arg.message && arg.stack){
                formattedArgs.push(arg.stack);
            } else{
                formattedArgs.push(arg);
            }
        }
    }catch (e) {
        formattedArgs = logs;
    }
    if(this.logLevel - 1 >= 0) {
        this.logOutput('error', formattedArgs);
    }
};

Logger.prototype.warn = function (...logs){
    let formattedArgs = [];
    logs.forEach(arg => {
        formattedArgs.push(typeof arg === 'string' ? arg : JSON.stringify(arg));
    });
    if(this.logLevel - 2 >= 0){
        this.logOutput('warn', formattedArgs);
    }
};

Logger.prototype.debug = function (...logs){
    const formattedArgs = [];
    logs.forEach(arg => {
        formattedArgs.push(typeof arg === 'string' ? arg : JSON.stringify(arg));
    });
    if(this.logLevel - 4 >= 0){
        this.logOutput('debug', formattedArgs);
    }
};

Logger.prototype.log = function (...logs) {
    const formattedArgs = [];
    logs.forEach(arg => {
        formattedArgs.push(typeof arg === 'string' ? arg : JSON.stringify(arg));
    });
    if(this.logLevel - 3 >= 0){
        this.logOutput('log', formattedArgs);
    }
};

module.exports = Logger;
