const fp = require('fastify-plugin');

const sites = fp(async (server) => {
    // Get on sites for now becuase it makes testing easier
    server.get(
        '/sites',
        {
            schema: {
                response: {
                    '2XX': {
                        type: 'array',
                        items: {
                            type: 'string',
                            format: 'uuid',
                        },
                    },
                },
            },
        },
        async (req, res) => {
            const sites = await server
                .client('construction_sites')
                .select('id');
            const site_ids = sites.map((site) => site.id);
            res.header('content-type', 'application/json');
            res.code(200).send(site_ids);
        }
    );
});

module.exports = sites;
