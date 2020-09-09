'use strict';

const NoPlateauCreatedException = use('App/Exceptions/Plateau/NoPlateauCreatedException');
const RoverExceededPlateauSizeException = use('App/Exceptions/Rover/RoverExceededPlateauSizeException');
const Plateau = use('App/Models/Plateau');
const Rover = use('App/Models/Rover');

/**
 * Service for plateau
 */
class PlateauService {

    /**
     * Validate plateau bondaries when creating/updating a rover
     * @param {Plateau} plateau 
     * @param {int} rover_x_position 
     * @param {int} rover_y_position 
     * @param {int} id_company 
     * @param {String} roverCode 
     */
    static validatePlateauAndBoundaries(plateau, rover_x_position, rover_y_position, id_company, roverCode){
        if (plateau){
            if (rover_x_position > plateau.upper_x_position || rover_y_position > plateau.upper_y_position){
                throw new RoverExceededPlateauSizeException(roverCode, plateau.code);
            }
        } else {
            throw new NoPlateauCreatedException();
        }
    }
}

module.exports = PlateauService;