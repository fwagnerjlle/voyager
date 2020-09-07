'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class CompanyHasPlateauException extends LogicalException {
  constructor(code) {
    super(`Company with code ${code} has plateaus. It will not be deleted`);
  }

  handle(error, { response }) {
    response.status(HttpStatus.BAD_REQUEST).send(error.message);
  }
}

module.exports = CompanyHasPlateauException;
