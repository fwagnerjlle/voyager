'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class RoverOutOfBoundsException extends LogicalException {
  constructor(code) {
    super(`The rover ${code} went out of plateau boundaries. Please try again`);
  }

  handle(error, { response }) {
    response.status(HttpStatus.EXPECTATION_FAILED).send(error.message);
  }
}

module.exports = RoverOutOfBoundsException;
