'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class PlateauHasRoversException extends LogicalException {
  constructor(code) {
    super(`Plateau has rovers. It will not be deleted.`);
  }

  handle(error, { response }) {
    response.status(HttpStatus.PRECONDITION_FAILED).send(error.message);
  }
}

module.exports = PlateauHasRoversException;
