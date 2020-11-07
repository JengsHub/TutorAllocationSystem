# Server

Node.js server/API using Express, TypeORM, TypeScript Rest Framework, PostgreSQL, Docker

## Running the back end

The back end consists of the server and the database, both of which need to be run separately (in two separate terminal windows).
You must do the following before running them:

- Install [Docker](https://www.docker.com/get-started)
- Install [PostgreSQL](https://www.postgresql.org/download/)
- Create a .env file (copy the contents of the .env.example file into a .env file)
  - Note - configure this file differently according to your local environment _(the .env.example file is just a template)_

### Running the database

1. `cd scripts`
2. `./run-database.sh` will run a docker container with a postgres database (with properties set by your .env file)

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
