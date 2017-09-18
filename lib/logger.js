let winston = require('winston');

module.exports = ({activate}) => {

  let transports = []

  if (activate) {
    transports.push(new (winston.transports.Console)())
  }

  return new winston.Logger({
    level: 'info',
    transports: transports
  });
}