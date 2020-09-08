'use strict';

const MovementService = require('../../Services/MovementService');
const PlateauService = require('../../Services/PlateauService');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const HttpStatus = use('http-status-codes');

const NoPlateauCreatedException = use('App/Exceptions/Plateau/NoPlateauCreatedException');
const RoverExceededPlateauSizeException = use('App/Exceptions/Rover/RoverExceededPlateauSizeException');
const RoverNotFoundException = use('App/Exceptions/Rover/RoverNotFoundException');
const RoverAlreadyExistException = use('App/Exceptions/Rover/RoverAlreadyExistException');

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
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const {
      sortBy = 'name',
      descending = 'asc',
      search = '',
    } = request.all();

    const rovers = Rover.query().orderBy(sortBy, descending);

    if (search) {
        rovers.where(function() {
        this.where('code', 'like', `%${search}%`)
        .orWhere('name', 'like', `%${search}%`);
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
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    response.status(HttpStatus.METHOD_NOT_ALLOWED).send('Method not available for Rover. Use POST on /rovers to create a new rover');
  }

  /**
   * Create/save a new rover.
   * POST rovers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
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
    
    const plateauService = new PlateauService();
    plateauService.validatePlateauBoundaries(await Plateau.query().where({ id_company }).first(), x_position, y_position, id_company, code);

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
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    return Rover.query().where({id: params.id}).first();
  }

  /**
   * Render a form to update an existing rover.
   * GET rovers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
    response.status(HttpStatus.METHOD_NOT_ALLOWED).send('Method not available for Rover. Use PUT on /rovers to update a Rover');
  }

  /**
   * Update rover details.
   * PUT or PATCH rovers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
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

    const plateauService = new PlateauService();
    plateauService.validatePlateauBoundaries(await Plateau.query().where({ id_company }).first(), x_position, y_position, id_company, code);

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
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
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

    const movService = new MovementService();
    movService.moveRover(Array.from(instruction), rover);
    rover.save();
    
    return rover;
  }
}

module.exports = RoverController;
