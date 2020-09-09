'use strict';

const Factory = use('Factory')
const HttpStatus = use('http-status-codes');

const Suite = use('Test/Suite')('Plateau');

const Plateau = use('App/Models/Plateau');
const Company = use('App/Models/Company');
const Rover = use('App/Models/Rover');

const { test, trait, beforeEach, afterEach } = Suite;

trait('Test/ApiClient');

let plateau1;
let plateau2;
let company1;
let rover1;

beforeEach(async () => {
  plateau1 = await Factory.model('App/Models/Plateau').create();
  plateau2 = await Factory.model('App/Models/Plateau').create();
});

afterEach(async () => {
  await Plateau.query().delete();
  await Company.query().delete();
  await Rover.query().delete();
});

test('list plateaus', async ({ client, assert }) => {
  //act
  const response = await client
    .get('api/plateaus')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
});

test('list plateaus - default order by name', async ({ client, assert }) => {
  //arrange
  plateau1.name = 'B';
  plateau2.name = 'A';
  await plateau1.save();
  await plateau2.save();

  //act
  const response = await client
    .get('api/plateaus')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, plateau2.id);
  assert.equal(response.body[1].id, plateau1.id);
});

test('list plateaus - default order by name - desc', async ({ client, assert }) => {
  //arrange
  plateau1.name = 'B';
  plateau2.name = 'A';
  await plateau1.save();
  await plateau2.save();

  //act
  const response = await client
    .get('api/plateaus?descending=desc')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, plateau1.id);
  assert.equal(response.body[1].id, plateau2.id);
});

test('list plateaus - order by upper_x_position', async ({ client, assert }) => {
  //arrange
  plateau1.upper_x_position = 5;
  plateau2.upper_x_position = 2;
  await plateau1.save();
  await plateau2.save();

  //act
  const response = await client
    .get('api/plateaus?sortBy=upper_x_position')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, plateau2.id);
  assert.equal(response.body[1].id, plateau1.id);
});

test('list plateaus - order by upper_y_position', async ({ client, assert }) => {
  //arrange
  plateau1.upper_y_position = 5;
  plateau2.upper_y_position = 2;
  await plateau1.save();
  await plateau2.save();

  //act
  const response = await client
    .get('api/plateaus?sortBy=upper_y_position')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, plateau2.id);
  assert.equal(response.body[1].id, plateau1.id);
});

test('list plateaus - search', async ({ client, assert }) => {
  company1 = await Factory.model('App/Models/Company').create();

  //arrange
  plateau1.name = 'Mars';
  plateau1.id_company = company1.id;
  await plateau1.save();

  //act
  const response = await client
    .get('api/plateaus?search=Mars')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].id, plateau1.id);
});

test('create plateau - not implemented', async ({ client, assert }) => {
  //act
  const response = await client
    .get('api/plateaus/create')
    .end();

  //assert
  response.assertStatus(HttpStatus.METHOD_NOT_ALLOWED);
});

test('create plateau', async ({ client, assert }) => {

  company1 = await Factory.model('App/Models/Company').create();

  //arrange
  const data = {
    code: 'Plateau Code1',
    name: 'Mars',
    upper_x_position: 10,
    upper_y_position: 10,
    id_company: company1.id,
  }

  //act
  const response = await client
    .post('api/plateaus')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.code, data.code);
  assert.equal(response.body.name, data.name);
  assert.equal(response.body.upper_x_position, data.upper_x_position);
  assert.equal(response.body.upper_y_position, data.upper_y_position);
  assert.equal(response.body.id_company, data.id_company);
  assert.exists(response.body.id);
  assert.exists(response.body.created_at);
  assert.exists(response.body.updated_at);
});

test('create plateau - code exists', async ({ client, assert }) => {
  //arrange
  const data = {
    code: plateau1.code,
    name: 'Mars2',
    upper_x_position: 10,
    upper_y_position: 10,
    id_company: 50,
  };

  //act
  const response = await client
    .post('api/plateaus')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.CONFLICT);
});

test('create plateau - already exist a plateau at company', async ({ client, assert }) => {
  //arrange
  const data = {
    code: 'New Plateau',
    name: 'Mars2',
    upper_x_position: 10,
    upper_y_position: 10,
    id_company: 1,
  };

  //act
  const response = await client
    .post('api/plateaus')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.CONFLICT);
});

test('show plateau', async ({ client, assert }) => {
  //act
  const response = await client
    .get(`api/plateaus/${plateau2.id}`)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.id, plateau2.id);
  assert.equal(response.body.code, plateau2.code);
  assert.equal(response.body.name, plateau2.name);
  assert.equal(response.body.upper_x_position, plateau2.upper_x_position);
  assert.equal(response.body.upper_y_position, plateau2.upper_y_position);
  assert.equal(response.body.created_at, plateau2.created_at);
  assert.equal(response.body.updated_at, plateau2.updated_at);
});

test('edit plateau - not implemented', async ({ client, assert }) => {
  //act
  const response = await client
    .get(`api/plateaus/${plateau2.id}/edit`)
    .end();

  //assert
  response.assertStatus(HttpStatus.METHOD_NOT_ALLOWED);
});

test('update plateau', async ({ client, assert }) => {
  //arrange
  const data = {
    code: plateau1.code,
    name: 'Mars',
    upper_x_position: 10,
    upper_y_position: 10,
    id_company: 1,
  }

  //act
  const response = await client
    .put(`api/plateaus/${plateau1.id}`)
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);

  const updatedPlateau = await Plateau.query().where({ id: plateau1.id }).first();

  assert.equal(updatedPlateau.id, plateau1.id);
  assert.equal(updatedPlateau.code, data.code);
  assert.equal(updatedPlateau.name, data.name);
  assert.equal(updatedPlateau.upper_x_position, data.upper_x_position);
  assert.equal(updatedPlateau.upper_y_position, data.upper_y_position);
  assert.equal(updatedPlateau.id_company, data.id_company);
});

test('update plateau - updating company, but has rovers', async ({ client, assert }) => {
  rover1 = await Factory.model('App/Models/Rover').create();

  //arrange
  const data = {
    code: 'Plateau',
    name: 'Mars',
    upper_x_position: 0,
    upper_y_position: 10,
    id_company: 2,
  }

  //act
  const response = await client
    .put(`api/plateaus/${plateau1.id}`)
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.PRECONDITION_FAILED);
  response.assertText('Plateau ' + plateau1.code + ' has rovers. It will not be updated or deleted.');
});

test('update plateau - updating x_position failed', async ({ client, assert }) => {
  rover1 = await Factory.model('App/Models/Rover').create();

  //arrange
  const data = {
    code: 'Plateau',
    name: 'Mars',
    upper_x_position: 0,
    upper_y_position: 10,
    id_company: 1,
  }

  //act
  const response = await client
    .put(`api/plateaus/${plateau1.id}`)
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.BAD_REQUEST);
  response.assertText('Plateau ' + plateau1.code + ' has rovers outside new boundaries values. It will not be updated.');
});

test('update plateau - updating y_position failed', async ({ client, assert }) => {
  rover1 = await Factory.model('App/Models/Rover').create();

  //arrange
  const data = {
    code: 'Plateau',
    name: 'Mars',
    upper_x_position: 10,
    upper_y_position: 0,
    id_company: 1,
  }

  //act
  const response = await client
    .put(`api/plateaus/${plateau1.id}`)
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.BAD_REQUEST);
  response.assertText('Plateau ' + plateau1.code + ' has rovers outside new boundaries values. It will not be updated.');
});

test('update plateau - invalid id', async ({ client, assert }) => {
  company1 = await Factory.model('App/Models/Company').create();
  //arrange
  const data = {
    code: 'Plateau',
    name: 'Mars',
    upper_x_position: 10,
    upper_y_position: 10,
    id_company: 1,
  }

  //act
  const response = await client
    .put('api/plateaus/777777777')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.BAD_REQUEST);
});

test('delete plateau', async ({ client, assert }) => {
  //act
  const response = await client
    .delete(`api/plateaus/${plateau1.id}`)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);

  const updatedPlateau = await Plateau.query().where({ id: plateau1.id }).first();

  assert.notExists(updatedPlateau);
});

test('delete plateau - invalid id', async ({ client, assert }) => {
  //act
  const response = await client
    .delete('api/plateaus/777777777')
    .end();

  //assert
  response.assertStatus(HttpStatus.BAD_REQUEST);
});

test('delete plateau - has rovers', async ({ client, assert }) => {

  rover1 = await Factory.model('App/Models/Rover').create();

  //act
  const response = await client
    .delete(`api/plateaus/${plateau1.id}`)
    .end();

  //assert
  response.assertStatus(HttpStatus.PRECONDITION_FAILED);
});