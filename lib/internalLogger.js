function loggerLogs(type, ...args) {
    console[type](new Date().toISOString(), '\x1b[32m', `[ LOGGER-${type.toUpperCase()} ]`, '\x1b[0m', ...args);
}

module.exports = {
    loggerLogs
};
