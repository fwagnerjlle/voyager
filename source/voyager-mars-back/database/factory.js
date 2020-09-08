'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
 const Factory = use('Factory')

// Factory.blueprint('App/Models/User', (faker) => {
//   return {
//     username: faker.username()
//   }
// })

Factory.blueprint('App/Models/Company', async ( faker) => {
  return {
    code: faker.word({ length: 4 }),
    name: faker.name(),
    description: faker.sentence({ words: 5 }),
    email: faker.email(),
  };
});

Factory.blueprint('App/Models/Plateau', async ( faker) => {
  return {
    code: faker.word({ length: 4 }),
    name: faker.name(),
    upper_x_position: 15,
    upper_y_position: 15,
    id_company: 1,
  };
});

Factory.blueprint('App/Models/Rover', async ( faker) => {
  return {
    code: faker.word({ length: 4 }),
    name: faker.name(),
    x_position: 1,
    y_position: 1,
    cardinal_direction: 'N',
    id_company: 1,
  };
});