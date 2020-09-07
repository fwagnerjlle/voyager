'use strict'

/*
|--------------------------------------------------------------------------
| CompanySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Company = use('App/Models/Company');

class CompanySeeder {
  async run () {
    const companyCount = await Company.query().getCount();

    if (companyCount === 0) {
      for(let c = 0; c < 50; c++) {
        await Factory.model('App/Models/Company').create();
      }
    } 
  }
}

module.exports = CompanySeeder
