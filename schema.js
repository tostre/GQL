const{GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList,GraphQLID, GraphQLNonNull} = require("graphql")
const Database = require("./database");
const db = new Database();



//////////////// Schema definition, from leafs to root
const RecipeType = new GraphQLObjectType({
    name: "Recipe",
    fields: {
        rId: {
            type: GraphQLInt,
            resolve: (root) => {
                return root.rId;
            }
        },
        name: {
            type: GraphQLString,
            resolve: (root) => {
                return root.name;
            }
        },
        rating: {
            type: GraphQLInt,
            resolve: (root) => {
                return root.rating;
            }
        }
    }
});

const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        uId: {
          type: GraphQLInt,
            resolve: (root) => {
              return root.uId;
            }
        },
        name: {
            type: GraphQLString,
            resolve: (root) => {
                return root.name;
            }
        },
        rating: {
            type: GraphQLInt,
            resolve: (root) => {
                return root.rating;
            }
        },
        recipes: {
            type: new GraphQLList(RecipeType),
            resolve: (root) => {
                return db.query(`SELECT rId FROM user_recipes WHERE uId = ${root.uId}`)
                    .then((rows) => {
                        var recipeIds = rows[0].rId;
                        for(var i = 0; i < rows.length-1; i++){
                            recipeIds += " OR rId = ";
                            recipeIds += rows[i+1].rId;
                        }
                        return recipeIds;
                    }).then((recipeIds) => {
                        return db.query(`SELECT * FROM recipes WHERE rId = ${recipeIds}`);
                    }).then((rows) => {
                        return rows;
                    })
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: () => ({
            user: {
                type: UserType,
                args: {
                    // The uId must be provided, else ther will be an error
                    uId: {type: new GraphQLNonNull(GraphQLInt)},
                    name: {type: GraphQLString}
                },
                resolve: (root, args) => {
                    return db.query(`SELECT * FROM users WHERE uId = ${args.uId}`)
                        .then((rows) => {
                            return rows[0];
                        })
                }
            },
            //TEST
            recipe: {
                type: RecipeType,
                args: {
                    // The rId must be provided, else ther will be an error
                    rId: {type: new GraphQLNonNull(GraphQLInt)},
                    name: {type: GraphQLString}
                },
                resolve: (root, args) => {
                    return db.query(`SELECT * FROM recipes WHERE rId = ${args.rId}`)
                        .then((rows) => {
                            return rows[0];
                        })
                }
            }
        })
    })
});