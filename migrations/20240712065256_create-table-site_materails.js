// 20240712065256_create-table-site_materails

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("site_materials", function (table) {
        // Use a uuid so that we have unique reference to materials that may have no unique name or other identifiers
        table.uuid("id").primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid("site_id").references("id").inTable("construction_sites").notNullable();
        table.string('name');
        table.decimal('volume_cubic_meters').notNullable();
        table.decimal('cost_per').notNullable();
        table.string('color').notNullable();
        table.dateTime('date_delivery');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("site_materials");
};
