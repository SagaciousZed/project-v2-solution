/**
 * Build fastify server with plugins. Useful for tests.
 *
 * @param {*} opts
 * @returns fastify
 */
const build = (opts) => {
    const fastify = require('fastify')(opts);

    // From example async initalization of fastify-cors plugin
    fastify.register(require('@fastify/cors'), {
        delegator: (req, callback) => {
            const corsOptions = {
                // This is NOT recommended for production as it enables reflection exploits
                origin: true,
            };

            // do not include CORS headers for requests from localhost
            if (/^localhost$/m.test(req.headers.origin)) {
                corsOptions.origin = false;
            }

            // callback expects two parameters: error and options
            callback(null, corsOptions);
        },
    });

    fastify.register(require('@fastify/swagger'));
    fastify.register(require('@fastify/swagger-ui'));

    fastify.register(require('./plugins/database'));

    fastify.register(require('./routes/sites'));
    fastify.register(require('./routes/materials'));

    return fastify;
};

module.exports = build;
