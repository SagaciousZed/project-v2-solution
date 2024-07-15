const knex = require("knex");
const uuid = require("uuid");
const connectionString = require("../connectionString");

const client = knex({
  client: "pg",
  connection: connectionString,
});

async function main() {
  //Delete all existing sites and create some dummy sites.
  await client("construction_sites").delete();
  await client("site_materials").delete();

  for (let i = 0; i < 10; i++) {
    const project = await client("construction_sites")
      .insert({
        id: uuid.v4(),
      })
      .returning("*");
    const site_id = project[0].id
    // Seed every site with the same sand
    console.log(`Created construction site with id ${site_id}`);
    const material = await client("site_materials")
      .insert({
        site_id: site_id,
        name: "Sand",
        volume_cubic_meters: 10000.0,
        cost_per: .08,
        color: "#C2B280"
      })
      .returning("*");
    console.log(`Created material ${material[0].id} for ${site_id}`)
  }
}

main()
  .catch((err) => {
    console.log(err);
  })
  .finally(() => client.destroy());
