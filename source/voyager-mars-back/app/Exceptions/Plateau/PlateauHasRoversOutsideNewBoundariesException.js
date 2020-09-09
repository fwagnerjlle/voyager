'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class PlateauHasRoversException extends LogicalException {
  constructor(code) {
    super(`Plateau ${code} has rovers outside new boundaries values. It will not be updated.`);
  }

  handle(error, { response }) {
    response.status(HttpStatus.BAD_REQUEST).send(error.message);
  }
}

module.exports = PlateauHasRoversException;
