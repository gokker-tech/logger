const { HighLevelProducer, KafkaClient } = require('kafka-node');
const { loggerLogs } = require('./internalLogger');

const CreateProducer = function (brokers) {
    const client = new KafkaClient({ kafkaHost: brokers });
    this.producer = new HighLevelProducer(client);
};

CreateProducer.prototype.publish = function (payload, level) {
    this.producer.on('ready', () => {
        this.producer.send(payload, (err, data) => {
            if(err)
                loggerLogs('error', 'Failed to publish messages -', err.message);
            else if(level === 'debug')
                loggerLogs(level,'Data publish to kafka -', data);
        });
    });
};

module.exports = {
    CreateProducer
};
