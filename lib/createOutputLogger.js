const path = require('path');
const fs = require('fs');
const { loggerLogs } = require('./internalLogger');

function createLogFilePath(filePath) {
    try{
        const dirNames = filePath.split('/');
        let currentPath = '';
        for(let i=0; i<dirNames.length - 1; i++){
            if(!dirNames[i]){
                continue;
            }
            currentPath += '/' + dirNames[i];
            if(fs.existsSync(currentPath)){
                continue;
            }
            fs.mkdirSync(currentPath);
        }
        return true;
    }catch (e) {
        loggerLogs('error', 'Failed to create logPath, please provide a file to write the logs -', path, '-', e.message)
        return false;
    }
}

const createFileLogger = (OPTIONS) => {
    if(!OPTIONS.filepath)
        loggerLogs('info', 'filePath was not provided, defaulting to ', path.resolve());
    const logFilePath = path.normalize(OPTIONS.filepath || `${path.resolve()}/grokkerLogger/logger_${new Date().valueOf()}.log`);
    const result = createLogFilePath(logFilePath);
    if(result){
        loggerLogs('info', `File driver was provided, writing to file - `, logFilePath);
        return fs.createWriteStream(logFilePath, { encoding: 'utf8', flags: 'a', mode: 0o666 });
    }
};

const createKafkaPayload = ({topic, date, esIndex, data, fileName, level}) => {
    const esObject =  {
        date,
        data,
        fileName,
        level,
    };
    if(esIndex){
        esObject.es_doc_props = {
            'id': new Date(date).valueOf(),
            'action': 'index',
            'index': esIndex
        };
    }
    return [
        {
            topic,
            messages: JSON.stringify(esObject)
        }
    ];
};

module.exports = {
    createFileLogger,
    createKafkaPayload
};
