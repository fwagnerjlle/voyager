'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const HttpStatus = use('http-status-codes');

const Plateau = use('App/Models/Plateau');
const Rover = use('App/Models/Rover');

const PlateauAlreadyExistException = use('App/Exceptions/Plateau/PlateauAlreadyExistException');
const PlateauNotFoundException = use('App/Exceptions/Plateau/PlateauNotFoundException');
const PlateauHasRoversException = use('App/Exceptions/Plateau/PlateauHasRoversException');
const PlateauAlreadyExistAtCompanyException = use('App/Exceptions/Plateau/PlateauAlreadyExistAtCompanyException');
const PlateauHasRoversOutsideNewBoundariesException = use('App/Exceptions/Plateau/PlateauHasRoversOutsideNewBoundariesException');

/**
 * Resourceful controller for interacting with plateaus
 */
class PlateauController {
  /**
   * Show a list of all plateaus.
   * GET plateaus
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

    const plateaus = Plateau.query().with('company').orderBy(sortBy, descending);
    
    if (search) {
      plateaus.where(function() {
        this.where('code', 'like', `%${search}%`)
        .orWhere('name', 'like', `%${search}%`)
        .orWhere('upper_x_position', 'like', `%${search}%`)
        .orWhere('upper_y_position', 'like', `%${search}%`)
        .orWhere(function () {
          this.whereHas('company', (cia) => {
            cia.where('name', 'like', `%${search}%`);
          })
        })
      });
    }

    return plateaus.fetch();
  }

  /**
   * Render a form to be used for creating a new plateau.
   * GET plateaus/create
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async create ({ response }) {
    response.status(HttpStatus.METHOD_NOT_ALLOWED).send('Method not available for Plateau. Use POST on /plateaus to create a new plateau');
  }

  /**
   * Create/save a new plateau.
   * POST plateaus
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request }) {
    const {
      code,
      name,
      upper_x_position,
      upper_y_position,
      id_company,
    } = request.all();

    const plateauExist = await Plateau.query().where({ code }).getCount() > 0;

    if(plateauExist) {
      throw new PlateauAlreadyExistException(code);
    }

    const plateauCompanyExist = await Plateau.query().where({ id_company }).getCount() > 0;
    if(plateauCompanyExist) {
      throw new PlateauAlreadyExistAtCompanyException();
    }

    return Plateau.create({
      code,
      name,
      upper_x_position,
      upper_y_position,
      id_company,
    });
  }

  /**
   * Display a single plateau.
   * GET plateaus/:id
   *
   * @param {object} ctx
   */
  async show ({ params }) {
    return Plateau.query().where({id: params.id}).first();
  }

  /**
   * Render a form to update an existing plateau.
   * GET plateaus/:id/edit
   *
   * @param {Response} ctx.response
   */
  async edit ({ response }) {
    response.status(HttpStatus.METHOD_NOT_ALLOWED).send('Method not available for Plateau. Use PUT on /plateaus to update a Plateau');
  }

  /**
   * Update plateau details.
   * PUT or PATCH plateaus/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update ({ params, request }) {
    const {
      code,
      name,
      upper_x_position,
      upper_y_position,
      id_company,
    } = request.all();

    const plateau = await Plateau.query().where({id: params.id}).first();
    if(!plateau) {
      throw new PlateauNotFoundException(params.id);
    }

    /* istanbul ignore else */
    if (id_company != plateau.id_company){

      const plateauCompanyExist = await Plateau.query().where({ id_company }).getCount() > 0;
      if(plateauCompanyExist) {
        throw new PlateauAlreadyExistAtCompanyException();
      }

      const rovers_at_plateau = await Rover.query().where('id_company', plateau.id_company).getCount() > 0;
      /* istanbul ignore else */
      if (rovers_at_plateau){
        throw new PlateauHasRoversException(plateau.code);
      }
    }

    /* istanbul ignore else */
    if (upper_x_position != plateau.upper_x_position){
      const rovers_over_x_position = await Rover.query().where('x_position', '>', upper_x_position).andWhere('id_company', id_company).getCount() > 0;
      /* istanbul ignore else */
      if (rovers_over_x_position){
        throw new PlateauHasRoversOutsideNewBoundariesException(plateau.code);
      }
    }

    /* istanbul ignore else */
    if (upper_y_position != plateau.upper_y_position){
      const rovers_over_y_position = await Rover.query().where('y_position', '>', upper_y_position).andWhere('id_company', id_company).getCount() > 0;
      /* istanbul ignore else */
      if (rovers_over_y_position){
        throw new PlateauHasRoversOutsideNewBoundariesException(plateau.code);
      }
    }

    plateau.merge({
      code,
      name,
      upper_x_position,
      upper_y_position,
      id_company,
    });

    return plateau.save();
  }

  /**
   * Delete a plateau with id.
   * DELETE plateaus/:id
   *
   * @param {object} ctx
   */
  async destroy ({ params }) {
    const plateau = await Plateau.query().where({id: params.id}).first();

    if(!plateau) {
      throw new PlateauNotFoundException(params.id);
    }
     
    const roverCount = await Rover.query().where({ id_company: plateau.id_company }).getCount() > 0;
    if (roverCount){
      throw new PlateauHasRoversException(plateau.code);
    }

    return plateau.delete();
  }
}

module.exports = PlateauController;
