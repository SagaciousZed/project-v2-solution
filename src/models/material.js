/**
 * Json schema for material payload
 */
const schema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        site_id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        volume_cubic_meters: { type: 'number', minimum: 0 },
        cost_per: { type: 'number', minimum: 0 }, // number type maybe not ideal for currency
        color: { type: 'string' }, // Needs a more restrictive format
        delivery_date: { type: 'string', format: 'date-time' },
    },
    required: ['volume_cubic_meters', 'cost_per', 'color'],
};

module.exports = schema;
