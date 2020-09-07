'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

const HttpStatus = use('http-status-codes');

class RoverExceededPlateauSizeException extends LogicalException {
    constructor(roverCode, plateauCode) {
        super(`The rover ${roverCode} wasn't created/updated because it's initial value exceeded plateau ${plateauCode} boundaries. Please try again`);
    }

  handle(error, { response }) {
    response.status(HttpStatus.CONFLICT).send(error.message);
  }
}

module.exports = RoverExceededPlateauSizeException;
