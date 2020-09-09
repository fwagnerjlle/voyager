'use strict';

const Factory = use('Factory')
const HttpStatus = use('http-status-codes');

const Suite = use('Test/Suite')('Rover');

const Rover = use('App/Models/Rover');
const Plateau = use('App/Models/Plateau');
const Company = use('App/Models/Company');

const { test, trait, beforeEach, afterEach } = Suite;

trait('Test/ApiClient');

let rover1;
let rover2;
let plateau1;
let company1;

beforeEach(async () => {
  rover1 = await Factory.model('App/Models/Rover').create();
  rover2 = await Factory.model('App/Models/Rover').create();
  company1 = await Factory.model('App/Models/Company').create();
  plateau1 = await Factory.model('App/Models/Plateau').create();
});

afterEach(async () => {
  await Rover.query().delete();
  await Plateau.query().delete();
  await Company.query().delete();
});

test('list rovers', async ({ client, assert }) => {
  //act
  const response = await client
    .get('api/rovers')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
});

test('list rovers - default order by name', async ({ client, assert }) => {
  //arrange
  rover1.name = 'B';
  rover2.name = 'A';
  await rover1.save();
  await rover2.save();

  //act
  const response = await client
    .get('api/rovers')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, rover2.id);
  assert.equal(response.body[1].id, rover1.id);
});

test('list rovers - default order by name - desc', async ({ client, assert }) => {
  //arrange
  rover1.name = 'B';
  rover2.name = 'A';
  await rover1.save();
  await rover2.save();

  //act
  const response = await client
    .get('api/rovers?descending=desc')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, rover1.id);
  assert.equal(response.body[1].id, rover2.id);
});

test('list rovers - order by x_position', async ({ client, assert }) => {
  //arrange
  rover1.x_position = 5;
  rover2.x_position = 2;
  await rover1.save();
  await rover2.save();

  //act
  const response = await client
    .get('api/rovers?sortBy=x_position')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, rover2.id);
  assert.equal(response.body[1].id, rover1.id);
});

test('list rovers - order by y_position', async ({ client, assert }) => {
  //arrange
  rover1.y_position = 5;
  rover2.y_position = 2;
  await rover1.save();
  await rover2.save();

  //act
  const response = await client
    .get('api/rovers?sortBy=y_position')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, rover2.id);
  assert.equal(response.body[1].id, rover1.id);
});

test('list rovers - order by cardinal_direction', async ({ client, assert }) => {
  //arrange
  rover1.cardinal_direction = 'S';
  rover2.cardinal_direction = 'N';
  await rover1.save();
  await rover2.save();

  //act
  const response = await client
    .get('api/rovers?sortBy=cardinal_direction')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, rover2.id);
  assert.equal(response.body[1].id, rover1.id);
});

test('list rovers - search', async ({ client, assert }) => {
  //arrange
  rover1.name = 'Ezequiel';
  await rover1.save();

  //act
  const response = await client
    .get('api/rovers?search=Ezequiel')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].id, rover1.id);
});

test('create rover - not implemented', async ({ client, assert }) => {
  //act
  const response = await client
    .get('api/rovers/create')
    .end();

  //assert
  response.assertStatus(HttpStatus.METHOD_NOT_ALLOWED);
});

test('create rover', async ({ client, assert }) => {
  plateau1.id_company = company1.id;
  await plateau1.save();

  //arrange
  const data = {
    code: 'ROVER1',
    name: 'Rover 1',
    x_position: 10,
    y_position: 8,
    cardinal_direction: 'S',
    id_company: company1.id,
  }

  //act
  const response = await client
    .post('api/rovers')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.code, data.code);
  assert.equal(response.body.name, data.name);
  assert.equal(response.body.x_position, data.x_position);
  assert.equal(response.body.y_position, data.y_position);
  assert.equal(response.body.cardinal_direction, data.cardinal_direction);
  assert.equal(response.body.id_company, data.id_company);
  assert.exists(response.body.id);
  assert.exists(response.body.created_at);
  assert.exists(response.body.updated_at);
});

test('create rover - RoverExceededPlateauSizeException', async ({ client, assert }) => {
  plateau1.id_company = company1.id;
  await plateau1.save();

  //arrange
  const data = {
    code: 'ROVER1',
    name: 'Rover 1',
    x_position: 20,
    y_position: 8,
    cardinal_direction: 'S',
    id_company: company1.id,
  }

  //act
  const response = await client
  .post('api/rovers')
  .send(data)
  .end();
  
  //assert
  response.assertStatus(HttpStatus.PRECONDITION_FAILED);
});

test('create rover - code exists', async ({ client, assert }) => {
  //arrange
  const data = {
    code: rover1.code,
    name: 'Dwayne',
    x_position: 10,
    y_position: 8,
    cardinal_direction: 'S',
    id_company: company1.id,
  };

  //act
  const response = await client
    .post('api/rovers')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.CONFLICT);
});

test('show rover', async ({ client, assert }) => {
  //act
  const response = await client
    .get(`api/rovers/${rover2.id}`)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.id, rover2.id);
  assert.equal(response.body.code, rover2.code);
  assert.equal(response.body.name, rover2.name);
  assert.equal(response.body.description, rover2.description);
  assert.equal(response.body.x_position, rover2.x_position);
  assert.equal(response.body.y_position, rover2.y_position);
  assert.equal(response.body.cardinal_direction, rover2.cardinal_direction);
  assert.equal(response.body.id_company, rover2.id_company);
  assert.equal(response.body.created_at, rover2.created_at);
  assert.equal(response.body.updated_at, rover2.updated_at);
});

test('edit rover - not implemented', async ({ client, assert }) => {
  //act
  const response = await client
    .get(`api/rovers/${rover2.id}/edit`)
    .end();

  //assert
  response.assertStatus(HttpStatus.METHOD_NOT_ALLOWED);
});

test('update rover', async ({ client, assert }) => {

  plateau1.id_company = company1.id;
  await plateau1.save();

  //arrange
  const data = {
    code: rover1.code,
    name: 'Name Updated',
    x_position: 7,
    y_position: 8,
    cardinal_direction: 'N',
    id_company: company1.id,
  }

    //act
  const response = await client
    .put(`api/rovers/${rover1.id}`)
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);

  const updatedRover = await Rover.query().where({ id: rover1.id }).first();

  assert.equal(updatedRover.id, rover1.id);
  assert.equal(updatedRover.code, data.code);
  assert.equal(updatedRover.name, data.name);
  assert.equal(updatedRover.x_position, data.x_position);
  assert.equal(updatedRover.y_position, data.y_position);
  assert.equal(updatedRover.cardinal_direction, data.cardinal_direction);
});

test('update rover - invalid id', async ({ client, assert }) => {
  //arrange
  const data = {
    code: 'ROVER1',
    name: 'Name Updated',
    x_position: 15,
    y_position: 12,
    cardinal_direction: 'N',
    id_company: company1.id,
  }

  //act
  const response = await client
    .put('api/rovers/777777777')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.BAD_REQUEST);
});

test('delete rover', async ({ client, assert }) => {
  //act
  const response = await client
    .delete(`api/rovers/${rover1.id}`)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);

  const updatedRover = await Rover.query().where({ id: rover1.id }).first();

  assert.notExists(updatedRover);
});

test('delete rover - invalid id', async ({ client, assert }) => {
  //act
  const response = await client
    .delete('api/rovers/777777777')
    .end();

  //assert
  response.assertStatus(HttpStatus.BAD_REQUEST);
});

test('move rover', async ({ client, assert }) => {

  const response = await client
  .put(`api/rovers/move/${rover1.id}?instruction=M`)
  .end();

  //assert
  response.assertStatus(HttpStatus.OK);
});