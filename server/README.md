# Server

Node.js server/API using Express, TypeORM, TypeScript Rest Framework, PostgreSQL, Docker

## Running the back end

The back end consists of the server and the database, both of which need to be run separately (in two separate terminal windows).

### Pre-requisites

You must do the following before running them:

- Install [Docker](https://www.docker.com/get-started)
- Create a .env file (copy the contents of the .env.example file into a .env file)
- Install the following NPM packages globally (using npm install -g)
  - typescript
  - nodemon
  - prettier
  - ts-node
  - typeorm
  - jest

### Running the database

_Note - make sure the terminal shell you use is bash, not cmd, powershell or anything else_

1. Stop any PostgreSQL services you have running (we only want the docker service spinning on port 5432) - If you've never installed PostgreSQL, don't worry about this step
2. `cd scripts`
3. `./run-database.sh` will run a docker container with a postgres database (with properties set by your .env file)
4. Go to pgadmin and create a server set to the right port and with the username and password set based on your .env file

### Running the server

1. `npm install` to install all npm packages you haven't already
2. `npm start` will compile the TypeScript files and run a nodemon server (hot-reloading) based on the compiled JS files
3. Run `npm run lint` after you've built (or made any changes) to automatically format your code (so the pipeline passes)

## Recommended tools/software

- Postman (for API testing)
- PGAdmin4 (for GUI of postgres database)
- VSCode extensions
  - Docker
  - Prettier
