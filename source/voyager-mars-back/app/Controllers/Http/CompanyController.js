'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const HttpStatus = use('http-status-codes');

const Company = use('App/Models/Company');
const Plateau = use('App/Models/Plateau');

const CompanyNotFoundException = use('App/Exceptions/Company/CompanyNotFoundException');
const CompanyAlreadyExistException = use('App/Exceptions/Company/CompanyAlreadyExistException');
const CompanyHasPlateauException = use('App/Exceptions/Company/CompanyHasPlateauException');

/**
 * Resourceful controller for interacting with companies
 */
class CompanyController {
  /**
   * Show a list of all companies.
   * GET companies
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

    const companies = Company.query().orderBy(sortBy, descending);

    if (search) {
      companies.where(function() {
        this.where('code', 'like', `%${search}%`)
        .orWhere('name', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`);
      });
    }

    return companies.fetch();
  }

  /**
   * Render a form to be used for creating a new company.
   * GET companies/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    response.status(HttpStatus.METHOD_NOT_ALLOWED).send('Method not available for Company. Use POST on /companies to create a new company');
  }

  /**
   * Create/save a new company.
   * POST companies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const {
      code,
      name,
      description,
      email,
    } = request.all();

    const companyExist = await Company.query().where({ code }).getCount() > 0;

    if(companyExist) {
      throw new CompanyAlreadyExistException(code);
    }

    return Company.create({
      code,
      name,
      description,
      email,
    });
  }

  /**
   * Display a single company.
   * GET companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    return Company.query().where({id: params.id}).first();
  }

  /**
   * Render a form to update an existing company.
   * GET companies/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
    response.status(HttpStatus.METHOD_NOT_ALLOWED).send('Method not available for Company. Use PUT on /companies to update a Company');
  }

  /**
   * Update company details.
   * PUT or PATCH companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const {
      code,
      name,
      description,
      email,
    } = request.all();

    const company = await Company.query().where({id: params.id}).first();

    if(!company) {
      throw new CompanyNotFoundException(params.id);
    }

    company.merge({
      code,
      name,
      description,
      email,
    });

    return company.save();
  }

  /**
   * Delete a company with id.
   * DELETE companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const company = await Company.query().where({id: params.id}).first();

    if(!company) {
      throw new CompanyNotFoundException(params.id);
    }

    const plateauCount = await Plateau.query().where({ id_company: params.id }).getCount() > 0;
    if (plateauCount){
      throw new CompanyHasPlateauException(company.code);
    }

    return company.delete();
  }
}

module.exports = CompanyController;
