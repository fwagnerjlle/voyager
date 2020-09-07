'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class PlateauAlreadyExistAtCompanyException extends LogicalException {
  constructor() {
    super(`There is already a Plateau created at this company`);
  }

  handle(error, { response }) {
    response.status(HttpStatus.CONFLICT).send(error.message);
  }
}

module.exports = PlateauAlreadyExistAtCompanyException;
