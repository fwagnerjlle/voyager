'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class CompanyNotFoundException extends LogicalException {
  constructor(id) {
    super(`Company with id ${id} not found`);
  }

  handle(error, { response }) {
    response.status(HttpStatus.BAD_REQUEST).send(error.message);
  }
}

module.exports = CompanyNotFoundException;
