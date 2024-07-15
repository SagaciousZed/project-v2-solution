describe('Materials Routes', function () {
    it('should reflect price with added material', async function () {
        const server = require('../src/app')();

        const sites = await server.inject({
            method: 'GET',
            url: '/sites',
        });

        const site = sites.json()[0];

        const site_pre_total_resp = await server.inject({
            method: 'GET',
            url: `/sites/${site}/materials/total`,
        });
        expect(site_pre_total_resp.statusCode).toBe(200);
        const pre_total = site_pre_total_resp.json().total;

        const payload = {
            name: 'Salt',
            volume_cubic_meters: 5.0,
            cost_per: 4784,
            color: '#FFFFFF',
        };
        const site_add_mat = await server.inject({
            method: 'PUT',
            url: `/sites/${site}/materials`,
            payload: payload,
        });
        expect(site_add_mat.statusCode).toBe(200);
        const added_material = site_add_mat.json();

        const added_cost = 5 * 4784;

        const site_post_total_resp = await server.inject({
            method: 'GET',
            url: `/sites/${site}/materials/total`,
        });
        const post_total = site_post_total_resp.json().total;

        expect(post_total).toBe(pre_total + added_cost);

        const site_post_materials = await server.inject({
            metod: 'GET',
            url: `/sites/${site}/materials`,
        });
        expect(site_post_materials.json()).toContain(added_material);

        const material_id = added_material.id;
        const delete_resp = await server.inject({
            method: 'DELETE',
            url: `/sites/${site}/materials/${material_id}`,
        });
        expect(delete_resp.statusCode).toBe(200);
    });
});
