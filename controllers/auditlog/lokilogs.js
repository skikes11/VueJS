const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");

// Logger
const logger = createLogger({
    transports: [
      new LokiTransport({
        host: "http://localhost:3100",
        // Only for development purposes
        interval: 5,
        labels: {
          job: 'nodejs-api-logging'
        }
      })
    ]
  })

module.exports = logger

