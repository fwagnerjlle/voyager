'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class PlateauNotFoundException extends LogicalException {
  constructor(id) {
    super(`Plateau with id ${id} not found`);
  }

  handle(error, { response }) {
    response.status(HttpStatus.BAD_REQUEST).send(error.message);
  }
}

module.exports = PlateauNotFoundException;
