function stdWriter(...args){
    process.stdout.write(args.join(' ') + '\n');
}

function loggerLogs(type, ...args) {
    stdWriter(new Date().toISOString(), '\x1b[32m', `[ LOGGER-${type.toUpperCase()} ]`, '\x1b[0m', ...args);
}

module.exports = {
    loggerLogs,
    stdWriter
};
