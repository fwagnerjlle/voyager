'use strict';

const Factory = use('Factory')

const Suite = use('Test/Suite')('Movement Service');
const { test, beforeEach, afterEach } = Suite;

const MovementService = use('App/Services/MovementService')
const CardinalDirections = use('App/Enums/CardinalDirectionEnum');
const Rover = use('App/Models/Rover');

let movementService;
let rover;
let rover2;

beforeEach(async () => {
  rover = await Factory.model('App/Models/Rover').create();
});

afterEach(async () => {
  await Rover.query().delete();
});

test('validate cardinal directions', async ({ assert }) => {
    assert.equal(CardinalDirections.NORTH, MovementService.getDirection('N'));
    assert.equal(CardinalDirections.SOUTH, MovementService.getDirection('S'));
    assert.equal(CardinalDirections.WEST, MovementService.getDirection('W'));
    assert.equal(CardinalDirections.EAST, MovementService.getDirection('E'));
})

test('validate left movements', async ({ assert }) => {
  rover.cardinal_direction = 'N';
  MovementService.moveRover('L', rover);

  assert.equal('W', rover.cardinal_direction);

  rover.cardinal_direction = 'W';
  MovementService.moveRover('L', rover);

  assert.equal('S', rover.cardinal_direction);

  rover.cardinal_direction = 'S';
  MovementService.moveRover('L', rover);

  assert.equal('E', rover.cardinal_direction);

  rover.cardinal_direction = 'E';
  MovementService.moveRover('L', rover);

  assert.equal('N', rover.cardinal_direction);
})

test('validate right movements', async ({ assert }) => {
  rover.cardinal_direction = 'N';
  MovementService.moveRover('R', rover);

  assert.equal('E', rover.cardinal_direction);

  rover.cardinal_direction = 'W';
  MovementService.moveRover('R', rover);

  assert.equal('N', rover.cardinal_direction);

  rover.cardinal_direction = 'S';
  MovementService.moveRover('R', rover);

  assert.equal('W', rover.cardinal_direction);

  rover.cardinal_direction = 'E';
  MovementService.moveRover('R', rover);

  assert.equal('S', rover.cardinal_direction);
})

test('validate only M movements', async ({ assert }) => {
  const initial_x_position = rover.x_position;
  const initial_y_position = rover.y_position;

  MovementService.moveRoverPosition(rover);
  assert.equal(rover.x_position, initial_x_position);
  assert.equal(rover.y_position, initial_y_position+1);

  rover.x_position = initial_x_position;
  rover.y_position = initial_y_position;
  rover.cardinal_direction = 'W';
  MovementService.moveRoverPosition(rover);
  assert.equal(rover.x_position, initial_x_position-1);
  assert.equal(rover.y_position, initial_y_position);

  rover.x_position = initial_x_position;
  rover.y_position = initial_y_position;
  rover.cardinal_direction = 'S';
  MovementService.moveRoverPosition(rover);
  assert.equal(rover.x_position, initial_x_position);
  assert.equal(rover.y_position, initial_y_position-1);

  rover.x_position = initial_x_position;
  rover.y_position = initial_y_position;
  rover.cardinal_direction = 'E';
  MovementService.moveRoverPosition(rover);
  assert.equal(rover.x_position, initial_x_position+1);
  assert.equal(rover.y_position, initial_y_position);
})

test('validate complete movements', async ({ assert }) => {
  rover.x_position = 1;
  rover.y_position = 2;
  rover.cardinal_direction = 'N';
  MovementService.moveRover('LMLMLMLMM', rover);

  assert.equal(1, rover.x_position);
  assert.equal(3, rover.y_position);
  assert.equal('N', rover.cardinal_direction);

  rover.x_position = 3;
  rover.y_position = 3;
  rover.cardinal_direction = 'E';
  MovementService.moveRover('MRRMMRMRRM', rover);

  assert.equal(2, rover.x_position);
  assert.equal(3, rover.y_position);
  assert.equal('S', rover.cardinal_direction);

  rover.x_position = 0;
  rover.y_position = 0;
  rover.cardinal_direction = 'S';
  MovementService.moveRover('LMLMRRRM', rover);

  assert.equal(0, rover.x_position);
  assert.equal(1, rover.y_position);
  assert.equal('W', rover.cardinal_direction);

  rover.x_position = 4;
  rover.y_position = 2;
  rover.cardinal_direction = 'W';
  MovementService.moveRover('LLMMRMMRRMM', rover);

  assert.equal(6, rover.x_position);
  assert.equal(2, rover.y_position);
  assert.equal('N', rover.cardinal_direction);
})

test('validate out of bounds (y) exception', async ({ assert }) => {
  try{
    MovementService.moveRover('LLMM', rover);
  } catch (e) {
    assert.equal(e.message, 'The rover '+rover.code+' went out of plateau boundaries. Please try again');
  }
})

test('validate out of bounds (x) exception', async ({ assert }) => {
  try{
    MovementService.moveRover('LMM', rover);
  } catch (e) {
    assert.equal(e.message, 'The rover '+rover.code+' went out of plateau boundaries. Please try again');
  }
})
