const fp = require('fastify-plugin');
const material_schema = require('../models/material');

const materials = fp(async (server) => {
    server.get(
        '/sites/:site/materials',
        {
            schema: {
                response: {
                    200: {
                        type: 'array',
                        items: material_schema,
                    },
                },
            },
        },
        async (req, res) => {
            const site_id = req.params.site;
            const materials = await server
                .client('site_materials')
                .where('site_id', req.params.site);
            res.header('content-type', 'application/json');
            res.code(200).send(materials);
        }
    );

    server.put(
        '/sites/:site/materials',
        {
            schema: {
                description:
                    'Create or Update material for given site. Provide existing material id to update.',
                body: material_schema,
                response: { 200: material_schema },
            },
        },
        async (req, res) => {
            const site_id = req.params.site;

            payload = req.body;
            payload.site_id = site_id;

            const result = await server
                .client('site_materials')
                // Is this safe to do with knex?
                .insert(payload)
                .onConflict('id')
                .merge()
                .returning('*');

            res.header('content-type', 'application/json');
            const material = result[0];
            // Convert strings from knex to number for response. Is knex is the wrong mode to return a number?
            // On the other hand, it could be to preserve precision
            // Found this when Fastify tried to enforce types on the repsonse
            material.volume_cubic_meters = Number(material.volume_cubic_meters);
            material.cost_per = Number(material.cost_per);
            res.code(200).send(material);
        }
    );

    server.get(
        '/sites/:site/materials/total',
        {
            schema: {
                description:
                    'Return the total cost of all materials at the given construction site',
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            site_id: { type: 'string', format: 'uuid' },
                            total: { type: 'number' },
                        },
                    },
                },
            },
        },
        async (req, res) => {
            const site_id = req.params.site;

            // Need to figure out how to express this better with knex
            const total = await server.client.raw(
                'SELECT site_id, SUM(volume_cubic_meters * cost_per) as total from site_materials WHERE site_id = ? GROUP BY site_id',
                [site_id]
            );

            res.header('content-type', 'application/json');
            res.code(200).send(total.rows[0]);
        }
    );

    server.delete('/sites/:site/materials/:material', async (req, res) => {
        // Since I created uuid for materials this is just for consistency
        const site_id = req.params.site;
        const id = req.params.material;

        const deletes = await server
            .client('site_materials')
            .where('id', id)
            .andWhere('site_id', site_id)
            .del();
        res.header('content-type', 'application/json');
        res.code(200).send(deletes);
    });

    console.log('Registered site_materials routes');
});

module.exports = materials;
