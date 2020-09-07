'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class CompanyAlreadyExistException extends LogicalException {
  constructor(code) {
    super(`Company with code ${code} already exists`);
  }

  handle(error, { response }) {
    response.status(HttpStatus.CONFLICT).send(error.message);
  }
}

module.exports = CompanyAlreadyExistException;
