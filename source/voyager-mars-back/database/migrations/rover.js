'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoverSchema extends Schema {
  up () {
    this.create('rovers', (table) => {
      table.increments();
      table.timestamps();
      table.string('code');
      table.string('name');
      table.integer('x_position');
      table.integer('y_position');
      table.string('cardinal_direction');
      table.integer('id_company').unsigned().references('id').inTable('companies');
    })
  }

  down () {
    this.drop('rovers')
  }
}

module.exports = RoverSchema
