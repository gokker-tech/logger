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
        const pathLenght = callerfilePath.length;
        callerfile = pathLenght > 2 ? `${callerfilePath[pathLenght - 2]}/${callerfilePath[pathLenght - 1]}`: callerfilePath[pathLenght - 1];
    }
    return callerfile;
};

const info = (...args) => {
    console.info(new Date().toISOString(), '\x1b[32m', `[ INFO  ]`, '\x1b[0m',  `--- [   ${_getCallerFile()}   ] : `, ...args);
};

const error = (...args) => {
    let formattedArgs = [];
    try {
        for(let i=0; i<args.length; i++){
            const arg = args[i];
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
        formattedArgs = args;
    }
    console.info(new Date().toISOString(), '\x1b[31m', `[ ERROR ]`, '\x1b[0m', `--- [   ${_getCallerFile()}   ] : `, ...formattedArgs);
};

const warn = (...args) => {
    console.info(new Date().toISOString(), '\x1b[33m', `[ WARN  ]`, '\x1b[0m',`--- [   ${_getCallerFile()}   ] : `, ...args);
};


module.exports = {
    info,
    error,
    warn
};
