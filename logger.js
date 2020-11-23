// common module that is shared for logging
const log4js = require('log4js')

// default logger without config
const logger = log4js.getLogger()
logger.level = 'debug'

module.exports.logger = logger
