'use strict';

const CardinalDirections = use('App/Enums/CardinalDirectionEnum')
const Movements = use('App/Enums/Movements')
const RoverOutOfBoundsException = use('App/Exceptions/Rover/RoverOutOfBoundsException');

/**
 * Service for moving rovers
 */
class MovementService {

    /**
     * Iterate over char array to move rover on the plateau
     * @param {char[]} chars 
     * @param {Rover} rover 
     */
    static moveRover(chars, rover){
        for (var i = 0; i < chars.length; i++) {
            if (chars[i] == Movements.LEFT){
                rover.cardinal_direction = this.getDirection(rover.cardinal_direction).leftMovement;
              } else if (chars[i] == Movements.RIGHT){
                rover.cardinal_direction = this.getDirection(rover.cardinal_direction).rightMovement;
              } else {
                this.moveRoverPosition(rover);
                if (rover.x_position < 0 || rover.y_position < 0){
                  throw new RoverOutOfBoundsException(rover.code);
                }
              }
        }
    }

    /**
     * Get CardinalDirection from a direction
     * @param {char} direction 
     */
    static getDirection(direction) {
        switch(direction){
            case CardinalDirections.NORTH.direction:
                return CardinalDirections.NORTH;
            case CardinalDirections.SOUTH.direction:
                return CardinalDirections.SOUTH;
            case CardinalDirections.WEST.direction:
                return CardinalDirections.WEST;
            case CardinalDirections.EAST.direction:
                return CardinalDirections.EAST;    
        }
    }

    /**
     * Move (x or y direction) a rover
     * @param {Rover} rover 
     */
    static moveRoverPosition(rover){
        if (rover.cardinal_direction == CardinalDirections.NORTH.direction){
            rover.y_position++;
        } else if (rover.cardinal_direction == CardinalDirections.SOUTH.direction){
            rover.y_position--;
        } else if (rover.cardinal_direction == CardinalDirections.EAST.direction){
            rover.x_position++;
        /* istanbul ignore else */
        } else if (rover.cardinal_direction == CardinalDirections.WEST.direction){
            rover.x_position--;
        }
    }
   
}

module.exports = MovementService;