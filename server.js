// In der Datei wird ein einfacher Express-Server aufgesetzt
const express = require("express");
const nodejs = require("express-graphql");
const schema = require("./schema.js");
const server = new express();

server.use("/schema", nodejs({
    schema,
    graphiql: true
}));

server.listen(4000);
console.log("Server listening for querys ...");












