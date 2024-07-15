const fp = require('fastify-plugin');
const knex = require('knex');
const connectionString = require('../../connectionString');

// provided knex setup in plugin
const database = fp(async (fastify) => {
    const client = knex({
        client: 'pg',
        connection: connectionString,
    });

    fastify.decorate('client', client);
    fastify.addHook('onClose', async (instance) => {
        console.log('Closing database connections...');
        await instance.client.destroy();
        delete instance.client;
        console.log('Database shutdown successful.');
    });
});

module.exports = database;
