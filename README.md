# Cesium Project

This is my solution to the project. I've spent about 6 hours collecting on the code and debugging and it is still not particularly robust for production use. Built in documentation for the Rest endpoints is provided by built-in [Swagger UI](http://localhost:8080/documentation) once the server is started. I decided to swap out restify for fastify to get the plugin support for swagger and validation, and made testing easier for me.

## Setup
Install dependencies and start the stack, run the following:
```
npm install
docker compose build
docker compose up -d
```

To populate the database before making requests, run the following:
```
npm run db-migrate
npm run db-seed
```

### PostgreSQL

This project requires a PostgreSQL database. If you are not starting the database via docker compose, make sure to run the script in `./init-db/` or the migrations will not complete.
If you do not have PostgreSQL installed, one will be started via default docker compose command.

A debug administration interface provided by [pg_admin](https://hub.docker.com/r/dpage/pgadmin4/) can be started using the `--profile debug` with the docker compose.

### Database Connection

If you are using the above Docker compose command, no further action is needed on your part. If you are using your own database instances, modify `connectionString.js` to point to it before proceeding.

### Important third party libraries

- [fastify](https://fastify.dev/) - is used for the REST API server.
- [fastify-plugin](https://github.com/fastify/fastify-plugin) - is used for the REST API server
- [fastify-swagger](https://github.com/fastify/fastify-swagger) - Provides openapi support to fastify
- [fastify-swagger-ui](https://github.com/fastify/fastify-swagger-ui) - Provides a UI for swagger
- [fastify-cors](https://github.com/fastify/fastify-cors) - provide cors support for fastify
- [jasmine](https://jasmine.github.io/) - is used for unit testing
- [knexjs](http://knexjs.org/) - is used for Database calls, query building, and migrations

## Code

- `server.js` - entrypoint to the server running on 8080.
- `app.js` - contains the fastify-based API server
- `init-db/0001-init.sql` - contains sql for postgres to enable uuid_v4 generation function in the database
- `migrations/20210409000652_create-table-construction_sites.js` - a database migration that creates the `construction_sites` table which for the sake of this project is a single column with a uuid-based id that materials can be associated with.
- `migrations/20240712065256_create-table-site_materails.js` - a database migraiton that create sthe `site_materials` table which contians the data model for the project.
- `connectionString.js` - contains the Database connection string so that it can be shared by multiple files.
- `scripts/` - contains database scripts called by package.json for seeding, migrating, and rolling back the database.
- `spec/` - contains the tests executed by jasimine
- `src/plugins/database.js` - contains some glue code to use knex in fastify as a plugin
- `src/routes/materials.js` - contians the implementation of the routes for material handling in the project
- `src/routes/sites.js` - contains a route to return the list of sites seeded by the knex scripts
- `src/models/material.js` contains the json schema for the material object representation

## Scripts

| Task                  | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `start`               | Runs the server on port 8080                                                |
| `test`                | Runs jasmine tests. Have the database started and seeded                    |
| `prettier`            | Runs the formatter and fixes the formating                                  |
| `prettier-check`      | Runs the formmater ahd checks the formating                                 |
| `db-migrate`          | Applies all pending migrations to the database                              |
| `db-rollback`         | Rolls back last set of database migrations                                  |
| `db-seed`             | Seeds the database with test data                                           |
| `db-create-migration` | Creates a new database migration, takes a single parameter (migration name) |
