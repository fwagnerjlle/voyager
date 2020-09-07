'use strict';

const Factory = use('Factory')
const HttpStatus = use('http-status-codes');

const Suite = use('Test/Suite')('Company');

const Company = use('App/Models/Company');

const { test, trait, beforeEach, afterEach } = Suite;

trait('Test/ApiClient');

let company1;
let company2;

beforeEach(async () => {
  company1 = await Factory.model('App/Models/Company').create();
  company2 = await Factory.model('App/Models/Company').create();
});

afterEach(async () => {
  await Company.query().delete();
});

test('list companies', async ({ client, assert }) => {
  //act
  const response = await client
    .get('api/companies')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
});

test('list companies - default order by name', async ({ client, assert }) => {
  //arrange
  company1.name = 'B';
  company2.name = 'A';
  await company1.save();
  await company2.save();

  //act
  const response = await client
    .get('api/companies')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, company2.id);
  assert.equal(response.body[1].id, company1.id);
});

test('list companies - default order by name - desc', async ({ client, assert }) => {
  //arrange
  company1.name = 'B';
  company2.name = 'A';
  await company1.save();
  await company2.save();

  //act
  const response = await client
    .get('api/companies?descending=desc')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, company1.id);
  assert.equal(response.body[1].id, company2.id);
});

test('list companies - order by email', async ({ client, assert }) => {
  //arrange
  company1.email = 'b@b.com';
  company2.email = 'a@a.com';
  await company1.save();
  await company2.save();

  //act
  const response = await client
    .get('api/companies?sortBy=email')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, company2.id);
  assert.equal(response.body[1].id, company1.id);
});

test('list companies - search', async ({ client, assert }) => {
  //arrange
  company1.name = 'Wayne Corp';
  await company1.save();

  //act
  const response = await client
    .get('api/companies?search=Wayne Corp')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].id, company1.id);
});

test('create company - not implemented', async ({ client, assert }) => {
  //act
  const response = await client
    .get('api/companies/create')
    .end();

  //assert
  response.assertStatus(HttpStatus.METHOD_NOT_ALLOWED);
});

test('create company', async ({ client, assert }) => {
  //arrange
  const data = {
    code: 'AMZN',
    name: 'Amazon Inc',
    description: 'Great Description',
    email: 'contact@amzn.com',
  }

  //act
  const response = await client
    .post('api/companies')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.code, data.code);
  assert.equal(response.body.name, data.name);
  assert.equal(response.body.description, data.description);
  assert.equal(response.body.email, data.email);
  assert.exists(response.body.id);
  assert.exists(response.body.created_at);
  assert.exists(response.body.updated_at);
});

test('create company - code exists', async ({ client, assert }) => {
  //arrange
  const data = {
    code: company1.code,
    name: 'Amazon Inc',
    description: 'Great Description',
    email: 'contact@amzn.com',
  };

  //act
  const response = await client
    .post('api/companies')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.CONFLICT);
});

test('show company', async ({ client, assert }) => {
  //act
  const response = await client
    .get(`api/companies/${company2.id}`)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.id, company2.id);
  assert.equal(response.body.code, company2.code);
  assert.equal(response.body.name, company2.name);
  assert.equal(response.body.description, company2.description);
  assert.equal(response.body.email, company2.email);
  assert.equal(response.body.created_at, company2.created_at);
  assert.equal(response.body.updated_at, company2.updated_at);
});

test('edit company - not implemented', async ({ client, assert }) => {
  //act
  const response = await client
    .get(`api/companies/${company2.id}/edit`)
    .end();

  //assert
  response.assertStatus(HttpStatus.METHOD_NOT_ALLOWED);
});

test('update company', async ({ client, assert }) => {
  //arrange
  const data = {
    code: 'AMZN',
    name: 'Amazon Inc',
    description: 'Great Description',
    email: 'contact@amzn.com',
  }

  //act
  const response = await client
    .put(`api/companies/${company1.id}`)
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);

  const updatedCompany = await Company.query().where({ id: company1.id }).first();

  assert.equal(updatedCompany.id, company1.id);
  assert.equal(updatedCompany.code, data.code);
  assert.equal(updatedCompany.name, data.name);
  assert.equal(updatedCompany.description, data.description);
  assert.equal(updatedCompany.email, data.email);
});

test('update company - invalid id', async ({ client, assert }) => {
  //arrange
  const data = {
    code: 'AMZN',
    name: 'Amazon Inc',
    description: 'Great Description',
    email: 'contact@amzn.com',
  }

  //act
  const response = await client
    .put('api/companies/777777777')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.BAD_REQUEST);
});

test('delete company', async ({ client, assert }) => {
  //act
  const response = await client
    .delete(`api/companies/${company1.id}`)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);

  const updatedCompany = await Company.query().where({ id: company1.id }).first();

  assert.notExists(updatedCompany);
});

test('delete company - invalid id', async ({ client, assert }) => {
  //act
  const response = await client
    .delete('api/companies/777777777')
    .end();

  //assert
  response.assertStatus(HttpStatus.BAD_REQUEST);
});