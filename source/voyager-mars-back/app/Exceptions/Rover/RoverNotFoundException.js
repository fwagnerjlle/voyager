'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class RoverNotFoundException extends LogicalException {
  constructor(id) {
    super(`Rover with id ${id} not found`);
  }

  handle(error, { response }) {
    response.status(HttpStatus.BAD_REQUEST).send(error.message);
  }
}

module.exports = RoverNotFoundException;
