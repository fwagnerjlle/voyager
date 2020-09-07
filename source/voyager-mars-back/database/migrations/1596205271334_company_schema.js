'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CompanySchema extends Schema {
  up () {
    this.create('companies', (table) => {
      table.increments();
      table.timestamps();
      table.string('code');
      table.string('name');
      table.string('description');
      table.string('email');
    })
  }

  down () {
    this.drop('companies')
  }
}

module.exports = CompanySchema
