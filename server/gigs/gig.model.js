const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLInputObjectType,
} = require('graphql');

// Read more about types here https://mongoosejs.com/docs/schematypes.html
const schema = new Schema({
  _userId: { type: ObjectId, required: true },
  _providerName: { type: String },
  _rating: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  validUntil: { type: Date },
  title: { type: String, required: true },
  slug: { type: String },
  description: { type: String },
  description_short: { type: String },
  images: { type: [String] },
  price: { type: Number },
  tags: { type: [String] },
  status: { type: [String], required: true },
  categories: { type: [String] },
  location: {
    address: { type: String },
    type: { type: String },
    coordinates: [Number],
  },
});

const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
schema.set('toJSON', { virtuals: true });
schema.plugin(mongoose_fuzzy_searching, {
  fields: [
    {
      name: 'title',
      minSize: 4,
    },
    {
      name: 'description',
      minSize: 4,
    },
  ],
});
const Gig = mongoose.model('Gig', schema);
Gig.fuzzySearch('face')
  .then(data => data.map(d => console.log(d.title)))
  .catch(err => console.error(err));

// GraphQL declarations
const fields = {
  _id: { type: GraphQLID },
  _userId: { type: GraphQLNonNull(GraphQLID) },
  _providerName: { type: GraphQLString },
  _rating: { type: GraphQLFloat },
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  images: { type: GraphQLList(GraphQLString) },
  tags: { type: GraphQLList(GraphQLString) },
  price: { type: GraphQLInt },
};

const fields_location = {
  address: { type: GraphQLString },
  type: { type: GraphQLString },
  coordinates: { type: GraphQLList(GraphQLFloat) },
};

// Nested fields needed for Queries
const GigLocationTypeOutput = new GraphQLObjectType({
  name: 'GigLocationOutput',
  fields: fields_location,
});

// Nested fields needed for Mutations
const GigLocationTypeInput = new GraphQLInputObjectType({
  name: 'GigLocationInput',
  fields: fields_location,
});

// Used to create the regular Query {} fields
const fieldsOutput = Object.assign({}, fields, {
  location: {
    type: GigLocationTypeOutput,
  },
});

// Used to create the Mutation {} fields
const fieldsInput = Object.assign({}, fields, {
  location: {
    type: GigLocationTypeInput,
  },
});

const GigType = new GraphQLObjectType({
  name: 'Gig',
  description: 'Gig type definition',
  fields: fieldsOutput,
});

module.exports = { Gig, GigType, schema, fieldsInput };
