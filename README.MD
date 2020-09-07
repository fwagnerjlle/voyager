# Voyager Mars Rover

NASA is using commercial companies to explore the Mars terrain. Each company received a specific plateau to explore and was allowed to send as many rovers as it wants to Mars.

Each plateau, which is curiously rectangular, must be navigated by the rovers so that their on-board cameras can get a complete view of the surrounding terrain to send back to Earth.

A rover’s position and location is represented by a combination of x and y coordinates and a letter representing one of the four cardinal compass points. The plateau is divided up into a grid to simplify navigation. An example position might be 0, 0, N, which means the rover is in the bottom left corner and facing North.

In order to control a rover, NASA sends a simple string of letters. The possible letters are ‘L’, ‘R’ and ‘M’. ‘L’ and ‘R’ makes the rover spin 90 degrees left or right respectively, without moving from its current spot. ‘M’ means move forward one grid point, and maintain the same heading.

The current application already allows the user to create, update and delete companies. We need to improve this application to allow users to manage the plateau, manage the rovers, control the rovers and display the rover position on the plateau.

## Plateau

Each company may have different plateau sizes, so we need to define the upper-right coordinates of the plateau since the lower-left coordinates will be 0,0 for all companies.

## Rover

Each company may have multiple rovers already landed on Mars, so we need to know the rover's initial landing position.\
After sending all commands to the rover, we need to know its new position on the plateau.

## Commands example
- If the rover's current position is `1 2 N` and we send to this rover the commands `LMLMLMLMM`, this rover's new position will be `1 3 N`
- If the rover's current position is `3 3 E` and we send to this rover the commands `MRRMMRMRRM`, this rover's new position will be `2 3 S`

## Technical Requirements
- All information must be persisted in the database

## What is expected from the application

To make the application ready for the Mars Rover Mission, NASA expects that the application will allow the users to:
- Define the plateau size by company like describe on [plateau](#plateau)
- Create, update and delete the company's rovers
- Add the rover landing position, send commands to the rovers and check the rover new position
- Use the coordinates and command patterns like it is described on [Voyager Mars Rover](#voyager-mars-rover), [Rover](#rover) and [Commands Example](#commands-example)
- Because the information takes a while to arrive on mars, the movement commands to move each rover must be sent at once, like in the [commands example](#commands-example).

## What is NOT expected from the application

- It's not necessary to display the rover's position in a graphical way, just the coordinates and the heading of the rover on the plateau.

## Don't hesitate to ask if remain any question about the project, the business rules, environment or any oother question.
- Use the contacts sent to you by email

# Voyager Mars Rover Application

Follow those steps to setup and start Voyager Mars Rover environment

## Setup Environment

### 1 - Download and Install:
- Docker
- Node 11 (optional to start the environment)

## Running Application

### 2 - Start docker
- run `docker-compose up` in `\voyager-mars-rover\` folder to startup the application

### 3 - Access the application in http://localhost:8080

## Backend Tests

To run the backend tests, execute `docker-compose up` inside folder `\voyager-mars-rover\composes\test-back\`

## Tips and Tricks
- Clean database via AdonisJS
  - `docker exec voyager-mars-backend adonis migration:reset`
- Hard clean database 
  - Delete the folder `\voyager-mars-rover\volumes\mysql\data`
- List all running docker conatiners
  - `docker ps`
- Connect into a running container
  - `docker exec -it container-name /bin/bash`
- Stop all docker containers
  - `docker stop $(docker ps -q)`
- Delete all docker containers
  - `docker rm -f $(docker ps -a -q)`
- Delete all docker images
  - `docker rmi -f $(docker images -q)`