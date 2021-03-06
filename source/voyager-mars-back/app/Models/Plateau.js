'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Plateau extends Model {
    company() {
        return this.hasOne('App/Models/Company', 'id_company', 'id');
    }
}

module.exports = Plateau
