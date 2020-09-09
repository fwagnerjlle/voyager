'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const HttpStatus = use('http-status-codes');

const RoverNotFoundException = use('App/Exceptions/Rover/RoverNotFoundException');
const RoverAlreadyExistException = use('App/Exceptions/Rover/RoverAlreadyExistException');
const MovementService = use('App/Services/MovementService');
const PlateauService = use('App/Services/PlateauService');

const Rover = use('App/Models/Rover');
const Plateau = use('App/Models/Plateau');

/**
 * Resourceful controller for interacting with rovers
 */
class RoverController {
  /**
   * Show a list of all rovers.
   * GET rovers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async index ({ request }) {
    const {
      sortBy = 'name',
      descending = 'asc',
      search = '',
    } = request.all();

    const rovers = Rover.query().with('company').orderBy(sortBy, descending);

    if (search) {
        rovers.where(function() {
        this.where('code', 'like', `%${search}%`)
        .orWhere('name', 'like', `%${search}%`)
        .orWhere(function () {
          this.whereHas('company', (cia) => {
            cia.where('name', 'like', `%${search}%`);
          })
        })
      });
    }

    const roverList = await rovers.fetch();

    return rovers.fetch();
  }

  /**
   * Render a form to be used for creating a new rover.
   * GET rovers/create
   *
   * @param {object} ctx
   * @param {Response} ctx.response
  */
  async create ({ response }) {
    response.status(HttpStatus.METHOD_NOT_ALLOWED).send('Method not available for Rover. Use POST on /rovers to create a new rover');
  }

  /**
   * Create/save a new rover.
   * POST rovers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request }) {
    const {
      code,
      name,
      x_position,
      y_position,
      cardinal_direction,
      id_company,
    } = request.all();

    const roverExist = await Rover.query().where({ code }).getCount() > 0;

    if (roverExist){
      throw new RoverAlreadyExistException(code);
    }
    
    await PlateauService.validatePlateauAndBoundaries(await Plateau.query().where({ id_company }).first(), x_position, y_position, code);

    return Rover.create({
      code,
      name,
      x_position,
      y_position,
      cardinal_direction,
      id_company,
    });
  }

  /**
   * Display a single rover.
   * GET rovers/:id
   *
   * @param {object} ctx
   */
  async show ({ params }) {
    return Rover.query().where({id: params.id}).first();
  }

  /**
   * Render a form to update an existing rover.
   * GET rovers/:id/edit
   *
   * @param {Response} ctx.response
   */
  async edit ({ response }) {
    response.status(HttpStatus.METHOD_NOT_ALLOWED).send('Method not available for Rover. Use PUT on /rovers to update a Rover');
  }

  /**
   * Update rover details.
   * PUT or PATCH rovers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update ({ params, request }) {
    const {
      code,
      name,
      x_position,
      y_position,
      cardinal_direction,
      id_company,
    } = request.all();

    const rover = await Rover.query().where({id: params.id}).first();

    if (!rover){
      throw new RoverNotFoundException(params.id);
    }

    await PlateauService.validatePlateauAndBoundaries(await Plateau.query().where({ id_company }).first(), x_position, y_position, code);

    rover.merge({
      code,
      name,
      x_position,
      y_position,
      cardinal_direction,
      id_company,
    });

    return rover.save();
  }

  /**
   * Delete a plateau with id.
   * DELETE rovers/:id
   *
   * @param {object} params
   */
  async destroy ({ params }) {
    const rover = await Rover.query().where({id: params.id}).first();

    if(!rover) {
      throw new RoverNotFoundException(params.id);
    }

    return rover.delete();
  }

  /**
   * Move rover 
   * PUT rovers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async move ({ params, request }) {
    const { instruction } = request.all();
    const rover = await Rover.find(params.id);
    
    MovementService.moveRover(Array.from(instruction), rover);

    await PlateauService.validatePlateauAndBoundaries(await Plateau.query().where('id_company', rover.id_company).first(), rover.x_position, rover.y_position, rover.code);

    await rover.save();
    
    return rover;
  }
}

module.exports = RoverController;
