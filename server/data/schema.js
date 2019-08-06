const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
	type User {
		email: String
		fullname: String
	}
	type Query {
		profile: User
	}
	type Mutation {
		createUser(email: String!, fullname: String, password: String!): User
		login(email: String!, password: String!): User
	}
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
