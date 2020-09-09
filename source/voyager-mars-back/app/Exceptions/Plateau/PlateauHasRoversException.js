'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class PlateauHasRoversException extends LogicalException {
  constructor(code) {
    super(`Plateau ${code} has rovers. It will not be updated or deleted.`);
  }

  handle(error, { response }) {
    response.status(HttpStatus.PRECONDITION_FAILED).send(error.message);
  }
}

module.exports = PlateauHasRoversException;
