// In der Datei wird ein einfacher Express-Server aufgesetzt
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema.js");
const server = new express();

server.use("/schema", graphqlHTTP({
    schema,
    graphiql: true
}));

server.listen(4000);
console.log("Server listening for querys ...");