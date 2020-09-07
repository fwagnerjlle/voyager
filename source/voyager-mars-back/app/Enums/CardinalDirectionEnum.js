'use strict'

const NORTH = { direction: 'N', leftMovement: 'W', rightMovement: 'E' };
const SOUTH = { direction: 'S', leftMovement: 'E', rightMovement: 'W' };
const WEST = { direction: 'W', leftMovement: 'S', rightMovement: 'N' };
const EAST = { direction: 'E', leftMovement: 'N', rightMovement: 'S' };

module.exports = { NORTH, SOUTH, WEST, EAST };