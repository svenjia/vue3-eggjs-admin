"use strict";
const assert = require("assert");
// let count = 0;
// const database = require("@adonisjs/lucid");
const { attachPaginate } = require("knex-paginate");
const knex = require("knex");
attachPaginate()
module.exports = app => {
    app.addSingleton("mysql", createOneClient);
};
function createOneClient(config, app) {
    assert(
        config.host && config.port && config.user && config.database,
        `[egg-mysql] 'host: ${config.host}', 'port: ${config.port}', 'user: ${config.user}', 'database: ${config.database}' are required on config`,
    );

    const cf = {
        client: "mysql",
        connection: config,
        debug: true,
        acquireConnectionTimeout: 10000,
    };

    // const cf = {
    //     "connection": "mysql",
    //     mysql: {
    //         client: 'mysql',
    //         connection: config,
    //         debug: true,
    //         acquireConnectionTimeout: 10000
    //     }
    // };
   
    return knex(cf);
    // const { db } = knex(cf);
    // return db;
}
