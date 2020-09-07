'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlateauSchema extends Schema {
  up () {
    this.create('plateaus', (table) => {
      table.increments();
      table.timestamps();
      table.string('code');
      table.string('name');
      table.integer('upper_x_position');
      table.integer('upper_y_position');
      table.integer('id_company').unsigned().references('id').inTable('companies');
    })
  }

  down () {
    this.drop('plateaus')
  }
}

module.exports = PlateauSchema
