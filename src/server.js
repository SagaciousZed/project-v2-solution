const fastify = require('./app')({ logger: true });

const bind_host = process.env.APP_BIND_HOST || "localhost"

fastify.listen({ port: 8080, host: bind_host }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});

let shuttingDown = false;
function shutdown() {
    if (shuttingDown) {
        return;
    }
    shuttingDown = true;

    const shutdownTimeout = setTimeout(function () {
        console.log('Shutdown failed, terminating process.');
        process.exit(0);
    }, 5000);

    console.log('Closing server connections...');
    fastify.close(() => {
        clearTimeout(shutdownTimeout);
    });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
